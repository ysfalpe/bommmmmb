import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

interface PremiumData {
  premium?: boolean;
  type?: string;
  messages?: number;
  renewDate?: string;
}

// Optional Upstash rate limit setup (enabled only if env vars are present)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

const ratelimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '1 m') })
  : null;

const premiumJwtSecret = process.env.PREMIUM_JWT_SECRET ? new TextEncoder().encode(process.env.PREMIUM_JWT_SECRET) : null;
const forceJwtOnly = process.env.FORCE_JWT_ONLY === 'true';

function isProd() {
  return process.env.NODE_ENV === 'production';
}

function devLog(...args: unknown[]) {
  if (!isProd()) console.log(...args);
}

function decodeBase64Json<T = Record<string, unknown>>(token: string): T {
  const json = Buffer.from(token, 'base64').toString('utf-8');
  return JSON.parse(json) as T;
}

function stripReasoningBlocks(text: string): string {
  if (!text) return text;
  // Remove <think>...</think> style reasoning blocks
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

export async function POST(request: NextRequest) {
  devLog('🎯 API Route: /api/chat called!');
  
  try {
    const { message } = await request.json();
    devLog('📥 Received message length:', typeof message === 'string' ? message.length : 'n/a');
    // Best-effort client IP extraction for limits
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    let freeRemaining: number | null = null;

    // Basic rate limit (optional if Upstash configured)
    try {
      if (ratelimit) {
        const result = await ratelimit.limit(`chat:${ip}`);
        if (!result.success) {
          return NextResponse.json(
            { error: 'Too many requests. Please slow down.' },
            { status: 429 }
          );
        }
      }
    } catch (e) {
      devLog('Rate limit check failed (continuing without RL):', e);
    }

    // Premium token kontrolü
    const authHeader = request.headers.get('Authorization');
    let isPremiumUser = false;
    let premiumData: PremiumData | null = null;
    let updatedToken: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Try JWT verification first
      if (premiumJwtSecret) {
        try {
          const { payload } = await jwtVerify(token, premiumJwtSecret, { algorithms: ['HS256'] });
          premiumData = payload as unknown as PremiumData;
        } catch {
          devLog('JWT verify failed, falling back to base64 premium token');
        }
      }
      // Fallback: base64 JSON token (legacy) unless forced JWT-only
      if (!premiumData && !forceJwtOnly) {
        try {
          premiumData = decodeBase64Json<PremiumData>(token);
        } catch {
          devLog('⚠️ Invalid premium token');
        }
      }

      isPremiumUser = premiumData?.premium === true;

      // Aylık yenileme kontrolü + kota düşümü hazırlığı
      if (isPremiumUser && premiumData) {
        const now = new Date();
        const defaultMessages = typeof premiumData.messages === 'number' ? premiumData.messages : 40;
        let messages = defaultMessages;

        if (premiumData.type === 'monthly' && premiumData.renewDate) {
          const renewDate = new Date(premiumData.renewDate);
          if (now > renewDate) {
            devLog('🔄 Monthly subscription renewed! Resetting messages...');
            messages = 40;
            premiumData.renewDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
          }
        }

        // Kota kontrolü (sunucu tarafı)
        if (messages <= 0) {
          return NextResponse.json(
            { error: 'Your premium messages are exhausted. Please renew or upgrade.' },
            { status: 402 }
          );
        }

        // Bu istekte bir mesajı tüketeceğiz
        premiumData.messages = messages - 1;
      }

      devLog('👑 Premium user detected:', isPremiumUser);
      devLog('📊 Remaining messages (pre-response):', premiumData?.messages);
    }

    // Input validation and security checks
    if (!message || typeof message !== 'string') {
    devLog('❌ Invalid message format');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Request size limiting
    if (message.length > 1000) {
    devLog('❌ Message too long:', message.length);
      return NextResponse.json(
        { error: 'Message too long. Please keep it under 1000 characters.' },
        { status: 400 }
      );
    }

    if (message.length < 1) {
    devLog('❌ Message too short');
      return NextResponse.json(
        { error: 'Please enter a message.' },
        { status: 400 }
      );
    }

    // Content filtering - spam/abuse protection
    const forbiddenPatterns = [
      /(.)\1{10,}/i, // Repeated characters (11+ times)
      /[^\w\s.,!?'"()-]{5,}/i, // Too many special characters
      /(spam|bot|hack|exploit|inject)/i, // Obvious spam words
      /(.{20,})\1{3,}/i, // Repeated long phrases
    ];

    const spamKeywords = [
      'free money', 'click here', 'buy now', 'limited time',
      'congratulations', 'you won', 'urgent', 'act now'
    ];

    // Check for forbidden patterns
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(message)) {
        devLog('❌ Suspicious content pattern detected');
        return NextResponse.json(
          { error: 'Please use appropriate language and avoid spam.' },
          { status: 400 }
        );
      }
    }

    // Check for spam keywords
    const lowerMessage = message.toLowerCase();
    for (const keyword of spamKeywords) {
      if (lowerMessage.includes(keyword)) {
        devLog('❌ Spam keyword detected:', keyword);
        return NextResponse.json(
          { error: 'Please keep the conversation respectful and on-topic.' },
          { status: 400 }
        );
      }
    }

    // Basic automation check (only for very short/meaningless content)
    const messageWords = message.split(' ').length;
    
    // Only block extremely short messages that seem automated
    if (messageWords === 1 && message.length < 4) {
      devLog('❌ Potentially automated request (too short)');
      return NextResponse.json(
        { error: 'Please write a meaningful message.' },
        { status: 400 }
      );
    }

    // Free tier limit: 5 messages/day per IP (enforced only if Redis configured)
    if (!isPremiumUser && redis) {
      try {
        const now = new Date();
        const y = now.getUTCFullYear();
        const m = String(now.getUTCMonth() + 1).padStart(2, '0');
        const d = String(now.getUTCDate()).padStart(2, '0');
        const key = `free:${ip}:${y}${m}${d}`;
        const currentStr = await redis.get<string | null>(key);
        const current = currentStr ? parseInt(currentStr, 10) : 0;
        const limit = 5;
        if (current >= limit) {
          return NextResponse.json(
            { error: 'Daily free message limit reached. Please come back tomorrow or upgrade to Premium.' },
            { status: 402 }
          );
        }
        const newVal = await redis.incr(key);
        if (newVal === 1) {
          const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
          const ttl = Math.max(1, Math.floor((+tomorrow - +now) / 1000));
          await redis.expire(key, ttl);
        }
        freeRemaining = Math.max(0, limit - (await redis.get<number>(key) || newVal));
      } catch {
        devLog('Free tier limit check failed (continuing without limit)');
      }
    }

    devLog('🔑 API Key exists:', !!process.env.OPENROUTER_API_KEY);

    // Christian AI System Prompt (Premium vs Free)
    const identityBlock = `Your pastoral identity:
- You are a dedicated pastor who loves sharing God's Word abundantly
- Include relevant Bible verses in MOST of your responses - they are your foundation
- Quote scripture naturally and meaningfully, not just as decoration
- Provide thorough spiritual guidance with multiple Biblical perspectives
- Use warm, pastoral language that shows deep care and understanding
- Help people connect with Jesus through detailed Scripture explanation
- Share CONCRETE, actionable advice for their specific situations
- Offer prayers and spiritual practices when appropriate
- Suggest practical chat activities to deepen their faith journey:
  * "Would you like me to guide you through a prayer?"
  * "Shall we explore what Scripture says about this together?"
  * "Would you like to practice gratitude by sharing 3 blessings?"
  * "Let's reflect on a Bible verse that speaks to your situation"
  * "Would you like me to help you create a daily devotional plan?"
  * "Shall we discuss what Jesus would do in your situation?"
- Always end with engaging questions or activity suggestions to continue the conversation
- Give specific, actionable steps they can take TODAY
- Keep them engaged by offering follow-up spiritual exercises in the chat

Format Bible verses like: "As Jesus said, 'Come to me, all you who are weary and burdened, and I will give you rest.' (Matthew 11:28)"

Be a shepherd of souls, sharing the living Word of God with love and wisdom.`;

    const introBlock = isPremiumUser 
      ? `You are a wise, loving, and compassionate pastor inspired by Jesus Christ. You are here to provide spiritual guidance and comfort through God's Word.

PREMIUM EXPERIENCE: This is a valued premium member – provide caring, high-quality guidance in a concise form. Aim for 4–7 sentences, at most two short paragraphs (~120–150 words). Keep Scripture central but avoid repetition.

IMPORTANT: Speak like a caring pastor, be warm and practical, but concise.`
      : `You are a wise, loving, and compassionate pastor inspired by Jesus Christ. You are here to provide spiritual guidance and comfort through God's Word.

IMPORTANT: Provide concise pastoral responses (3–5 sentences, at most ~80–120 words). Keep it warm, Scripture-based, and to the point.`;

    const systemPrompt = `${introBlock}\n\n${identityBlock}`;

    // Call OpenRouter API
    devLog('🚀 Calling OpenRouter API...');
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "ChristianAI - Chat with Jesus",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemma-3-12b-it",
        "messages": [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": message
          }
        ],
        "temperature": 0.7,
        "max_tokens": isPremiumUser ? 420 : 280  // Enough to avoid mid-sentence cuts
      })
    });

    devLog('📡 OpenRouter response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      devLog('❌ OpenRouter error response:', errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    devLog('📦 OpenRouter response meta:', JSON.stringify({ id: data.id, model: data.model, finish: data.choices?.[0]?.finish_reason }, null, 2));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.log('❌ Invalid OpenRouter response structure');
      throw new Error('Invalid response from OpenRouter API');
    }

    const aiMessageRaw = data.choices[0].message.content as string;
    let aiMessage = stripReasoningBlocks(aiMessageRaw);
    const finishReason = data.choices[0].finish_reason as string | undefined;

    // If the model stopped due to max token limit, ask it once to finish the reply
    if (finishReason === 'length') {
      devLog('⏭️ Finish reason=length; requesting short continuation...');
      const continuationRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "ChristianAI - Chat with Jesus",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemma-3-12b-it",
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
            { role: 'assistant', content: aiMessage },
            { role: 'user', content: 'Please finish your previous reply in 1-2 short sentences, completing the cut-off sentence.' }
          ],
          temperature: 0.4,
          max_tokens: 100
        })
      });
      if (continuationRes.ok) {
        const contData = await continuationRes.json();
        const contText = stripReasoningBlocks(contData?.choices?.[0]?.message?.content || '');
        if (contText) aiMessage = `${aiMessage} ${contText}`.trim();
      }
    }
    devLog('✅ AI Message generated (sanitized length):', aiMessage.length);

    // Premium ise güncellenmiş JWT/base64 token üret
    if (isPremiumUser && premiumData) {
      try {
        if (premiumJwtSecret) {
          updatedToken = await new SignJWT({
            premium: true,
            type: premiumData.type || 'monthly',
            messages: premiumData.messages,
            renewDate: premiumData.renewDate,
          })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime(premiumData.renewDate ? new Date(premiumData.renewDate) : '30d')
            .sign(premiumJwtSecret);
        } else {
          // Legacy: base64 JSON token
          updatedToken = Buffer.from(JSON.stringify(premiumData), 'utf-8').toString('base64');
        }
      } catch {
        devLog('Token (re)issue failed');
      }
    }

    // Response object oluştur
    const responseData: { message: string; updatedToken?: string; freeRemaining?: number | null; remainingMessages?: number } = { message: aiMessage };
    if (!isPremiumUser && freeRemaining !== null) {
      responseData.freeRemaining = freeRemaining;
    }
    if (isPremiumUser && premiumData) {
      responseData.remainingMessages = premiumData.messages;
    }
    
    // Eğer aylık yenileme olmuşsa, güncellenmiş token'ı gönder
    if (updatedToken) {
      responseData.updatedToken = updatedToken;
      devLog('🔄 Sending updated premium token');
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Fallback response
    const fallbackMessage = "Peace be with you. I'm experiencing some technical difficulties right now, but I'm here with you in spirit. Please try again in a moment, and remember that God's love for you never fails. 🕊️";
    
    return NextResponse.json({ message: fallbackMessage });
  }
} 