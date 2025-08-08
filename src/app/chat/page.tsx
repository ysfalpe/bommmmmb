'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

type MoodType = 'peaceful' | 'troubled' | 'curious' | 'grateful' | 'seeking' | null;

const moodMessages = {
  peaceful: "Peace be with you, dear child! 🕊️ As Jesus said, 'Peace I leave with you; my peace I give you.' (John 14:27) I'm blessed to sense God's peace in your heart today. How can I help you grow deeper in this sacred tranquility?",
  troubled: "My heart goes out to you in this difficult time. 💙 Remember Jesus's gentle invitation: 'Come to me, all you who are weary and burdened, and I will give you rest.' (Matthew 11:28) You are never alone in your struggles. What burden can we bring before the Lord together?",
  curious: "How wonderful that the Holy Spirit is stirring questions in your heart! 🌟 As Jesus promised, 'Ask and it will be given to you; seek and you will find.' (Matthew 7:7) Your seeking spirit is a beautiful gift from God. What aspects of faith are calling to you today?",
  grateful: "Your gratitude is a beautiful offering to the Lord! ✨ The Apostle Paul reminds us, 'Give thanks in all circumstances; for this is God's will for you in Christ Jesus.' (1 Thessalonians 5:18) I'd love to join you in praising God's goodness. What blessings is the Lord placing on your heart?",
  seeking: "Blessed are those who hunger and thirst for righteousness! 🙏 Jesus promised, 'Seek first his kingdom and his righteousness, and all these things will be given to you as well.' (Matthew 6:33) I'm honored to walk with you on this sacred journey. What is God calling you to discover?"
};

export default function ChatPage() {
  const [selectedMood, setSelectedMood] = useState<MoodType>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellShown, setUpsellShown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Premium states
  const [premiumToken, setPremiumToken] = useState<string | null>(null);
  const [premiumCode, setPremiumCode] = useState('');
  const [showPremiumInput, setShowPremiumInput] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState<number | null>(null);
  const [freeRemaining, setFreeRemaining] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Soft upsell: show after 3rd user message, once per session
  useEffect(() => {
    if (!isPremium && !upsellShown) {
      const userMsgCount = messages.filter(m => m.sender === 'user').length;
      if (userMsgCount >= 3) {
        setShowUpsell(true);
        setUpsellShown(true);
      }
    }
  }, [messages, isPremium, upsellShown]);

  // Premium token kontrolü - sayfa yüklendiğinde
  useEffect(() => {
    const savedToken = localStorage.getItem('premiumToken');
    if (savedToken) {
      try {
        // Try to parse as base64 JSON first (legacy)
        let decoded: { messages?: number } | null = null;
        try {
          decoded = JSON.parse(atob(savedToken)) as { messages?: number };
        } catch {
          // If not base64 JSON, assume JWT and parse payload
          const payload = JSON.parse(atob(savedToken.split('.')[1])) as { messages?: number };
          decoded = payload;
        }
        setPremiumToken(savedToken);
        setIsPremium(true);
        setRemainingMessages(decoded?.messages || 0);
      } catch {
        localStorage.removeItem('premiumToken');
      }
    }
    // Silent refresh using saved premium code if present and token missing/expired
    const savedCode = localStorage.getItem('premiumCode');
    if (!savedToken && savedCode) {
      (async () => {
        try {
          const res = await fetch('https://workers-playground-lingering-darkness-7b0d.adenalper.workers.dev/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: savedCode, refresh: true })
          });
          const data = await res.json();
          if (data?.success && data?.token) {
            localStorage.setItem('premiumToken', data.token);
            setPremiumToken(data.token);
            setIsPremium(true);
            setRemainingMessages(data.messages || 40);
          }
        } catch {}
      })();
    }
  }, []);

  // Premium kod aktivasyonu
  const activatePremiumCode = async () => {
    if (!premiumCode.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Cloudflare Worker'a istek gönder
      const response = await fetch('https://workers-playground-lingering-darkness-7b0d.adenalper.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: premiumCode })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('premiumToken', data.token);
        localStorage.setItem('premiumCode', premiumCode.trim());
        setPremiumToken(data.token);
        setIsPremium(true);
        setRemainingMessages(data.messages || 40);
        setShowPremiumInput(false);
        setPremiumCode('');
        
        // Başarı mesajı
        const successMessage: Message = {
          id: Date.now().toString(),
          text: `🎉 Premium access activated! You now have ${data.messages || 40} messages available. Welcome to ChristianAI Premium!`,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      } else {
        alert('Invalid premium code. Please check and try again.');
      }
    } catch {
      alert('Failed to activate premium code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelection = (mood: MoodType) => {
    if (!mood) return;
    
    setSelectedMood(mood);
    
    // Add welcome message based on mood
    const welcomeMessage: Message = {
      id: '1',
      text: moodMessages[mood],
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submitted!', { inputValue });
    
    if (!inputValue.trim()) {
      console.log('❌ Empty input, returning');
      return;
    }

    console.log('✅ Creating user message...');

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    console.log('📤 Starting API call...');

    // Call our API route for real AI response
    try {
      console.log('🔄 Making fetch request to /api/chat...');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Premium token varsa header'a ekle
      if (premiumToken) {
        headers['Authorization'] = `Bearer ${premiumToken}`;
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userMessage.text }),
      });

      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Response data:', data);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message || "I'm here to help you on your spiritual journey. How can I guide you today?",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // Free remaining counter from server (if provided)
      if (!isPremium && typeof data.freeRemaining === 'number') {
        setFreeRemaining(data.freeRemaining);
      }
      
      // Aylık yenileme token'ı kontrolü
       if (data.updatedToken) {
        console.log('🔄 Monthly renewal detected! Updating token...');
        localStorage.setItem('premiumToken', data.updatedToken);
        setPremiumToken(data.updatedToken);
        
        // Token'dan yeni mesaj sayısını al
        try {
          let decoded: { messages?: number } | null = null;
          try {
            decoded = JSON.parse(atob(data.updatedToken)) as { messages?: number };
          } catch {
            const payload = JSON.parse(atob(data.updatedToken.split('.')[1])) as { messages?: number };
            decoded = payload;
          }
          if (typeof decoded?.messages === 'number') {
            setRemainingMessages(decoded.messages);
            console.log('✅ Monthly renewal complete! New messages:', decoded.messages);
          }
        } catch {
          console.error('Updated token decode error');
        }
      } else if (isPremium && remainingMessages !== null) {
        // Server now decrements. Trust server; just display what comes via updatedToken next round.
        const newCount = Math.max(0, remainingMessages - 1);
        setRemainingMessages(newCount);
       }
      
      setIsLoading(false);
    } catch {
      console.error('❌ Error calling chat API');
      console.log('🔄 Using fallback message...');
      
      // Fallback message if API fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Peace be with you. I'm experiencing some technical difficulties right now, but I'm here with you in spirit. Please try again in a moment. 🕊️",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-sm font-bold">✝</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ChristianAI</span>
            </Link>
            
            {/* Navigation */}
            <div className="flex items-center space-x-3 md:space-x-6">
              {/* Premium Status */}
              {isPremium ? (
                <div className="flex items-center space-x-4">
                  <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200">
                    <svg className="w-4 h-4 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-sm font-medium text-amber-700">Premium</span>
                  </div>
                  {remainingMessages !== null && (
                    <div className="text-sm text-gray-600">
                      {remainingMessages} messages left
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <a
                    href="https://buymeacoffee.com/yaltech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
                    title="Founders discount • 40 messages/month"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Premium
                  </a>
                  <button
                    onClick={() => setShowPremiumInput(!showPremiumInput)}
                    className="inline-flex items-center px-4 py-2 rounded-full font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] cursor-pointer transition-all"
                    title="I have a code"
                    aria-expanded={showPremiumInput}
                  >
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a4 4 0 10-4 4h.5a2.5 2.5 0 012.5 2.5V15l2 2 2-2-2-2v-.5A4.5 4.5 0 0011.5 8H11"/></svg>
                    I have a code
                  </button>
                </div>
              )}
              
              <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Home
              </Link>
              <Link href="/pricing" className="hidden sm:inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Pricing
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Premium Code Input */}
      {showPremiumInput && (
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 py-4">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={premiumCode}
                  onChange={(e) => setPremiumCode(e.target.value.toUpperCase())}
                  placeholder="Enter your premium code (e.g., PREMIUM-2025-ABC123)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && activatePremiumCode()}
                />
              </div>
              <button
                onClick={activatePremiumCode}
                disabled={!premiumCode.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Activating...' : 'Activate'}
              </button>
              <button
                onClick={() => setShowPremiumInput(false)}
                className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              💰 Get your premium code by supporting us on{' '}
              <a href="https://buymeacoffee.com/yaltech" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">Buy Me a Coffee</a>
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        
        {/* Mood Selection Screen */}
        {!selectedMood && (
          <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
            <div className="w-full max-w-4xl">
              
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-sm mb-6">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Your AI Pastor is Ready</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  How are you feeling
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    today?
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Choose what resonates with your heart right now, and I'll offer the perfect spiritual guidance for this moment.
                </p>
              </div>

              {/* Mood Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <button
                  onClick={() => handleMoodSelection('peaceful')}
                  className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-400 hover:bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-left cursor-pointer transform-gpu"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-active:scale-95 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                    <span className="text-2xl">🕊️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition-colors duration-200">Peaceful</h3>
                  <p className="text-gray-600 text-sm text-center leading-relaxed group-hover:text-gray-700">I'm feeling calm and centered, grateful for God's peace in my heart today</p>
                  
                  {/* Click indicator */}
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => handleMoodSelection('troubled')}
                  className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-8 border-2 border-gray-200 hover:border-indigo-400 hover:bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-left cursor-pointer transform-gpu"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-active:scale-95 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                    <span className="text-2xl">💙</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-indigo-600 transition-colors duration-200">Troubled</h3>
                  <p className="text-gray-600 text-sm text-center leading-relaxed group-hover:text-gray-700">I'm struggling with something heavy and need comfort and guidance</p>
                  
                  <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => handleMoodSelection('curious')}
                  className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-8 border-2 border-gray-200 hover:border-amber-400 hover:bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-left cursor-pointer transform-gpu"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-active:scale-95 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-amber-600 transition-colors duration-200">Curious</h3>
                  <p className="text-gray-600 text-sm text-center leading-relaxed group-hover:text-gray-700">I have questions about faith, life, and want to explore deeper</p>
                  
                  <div className="absolute top-4 right-4 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => handleMoodSelection('grateful')}
                  className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-8 border-2 border-gray-200 hover:border-emerald-400 hover:bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-left cursor-pointer transform-gpu"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-active:scale-95 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-emerald-600 transition-colors duration-200">Grateful</h3>
                  <p className="text-gray-600 text-sm text-center leading-relaxed group-hover:text-gray-700">I want to celebrate and share God's blessings in my life</p>
                  
                  <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => handleMoodSelection('seeking')}
                  className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-400 hover:bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-left cursor-pointer transform-gpu md:col-span-2 lg:col-span-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-active:scale-95 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                    <span className="text-2xl">🙏</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-600 transition-colors duration-200">Seeking</h3>
                  <p className="text-gray-600 text-sm text-center leading-relaxed group-hover:text-gray-700">I'm looking for direction, purpose, and spiritual wisdom</p>
                  
                  <div className="absolute top-4 right-4 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </button>
              </div>

              {/* Trust Badge */}
              <div className="text-center">
                <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-sm">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Private • Secure • Scripture-Based</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Chat Container */}
        {selectedMood && (
          <div className="h-[calc(100vh-8rem)] flex flex-col">
          
          {/* Chat Header */}
          <div className="bg-white/80 backdrop-blur-md rounded-t-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">✝</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Your AI Pastor</h1>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Online • Ready to Help
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedMood(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Non-premium top notice */}
          {!isPremium && (
            <div className="border-x border-b border-amber-200 bg-amber-50 text-amber-800 px-6 py-3 text-sm">
              Founders Discount: 40% Off • Premium = deeper, more personal guidance + 40 messages/month.{' '}
              <a href="https://buymeacoffee.com/yaltech" target="_blank" rel="noopener noreferrer" className="underline font-medium">Get your code</a>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 bg-gradient-to-b from-white/50 to-blue-50/30 backdrop-blur-sm border-x border-gray-200 overflow-y-auto">
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
              
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    message.sender === 'ai' 
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                      : 'bg-gradient-to-br from-slate-600 to-slate-700'
                  }`}>
                    <span className="text-white text-lg">
                      {message.sender === 'ai' ? '✝' : '👤'}
                    </span>
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`group max-w-2xl ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl shadow-sm border transition-all duration-300 group-hover:shadow-md ${
                      message.sender === 'ai' 
                        ? 'bg-white/80 backdrop-blur-md text-gray-800 border-gray-200 rounded-tl-md' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 rounded-tr-md'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'ai' ? 'text-gray-400' : 'text-blue-100'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white text-lg">✝</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl rounded-tl-md p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">Pastor is typing...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />

            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white/80 backdrop-blur-md rounded-b-2xl border border-gray-200 p-6">
            <form onSubmit={handleSendMessage} className="relative" action="#">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Share your thoughts, ask questions, or request prayers..."
                    className="w-full bg-white/90 backdrop-blur-sm border border-gray-300 rounded-2xl pl-4 pr-12 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400 transition-all duration-200 shadow-sm font-medium"
                    disabled={isLoading}
                  />
                  
                  {/* Character count or status */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-lg"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Status / Trust message */}
              <div className="flex flex-wrap items-center justify-center mt-4 gap-4 text-xs text-gray-600">
                {!isPremium && freeRemaining !== null && (
                  <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700">
                    Today: {freeRemaining} free messages left
                  </div>
                )}
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                  </svg>
                  Private & Secure
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 mr-1">✝</span>
                  Scripture-Based
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Always Available
                </div>
              </div>
            </form>
          </div>

          </div>
        )}
        
      </div>

      {/* Premium Upsell Modal */}
      {showUpsell && !isPremium && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.64 12.545.76 8.41l6.09-.527L10 2l3.15 5.883 6.09.527-4.88 4.135 1.518 5.545z"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Would you like deeper guidance?</h3>
            </div>
            <p className="text-gray-700 mb-4">Upgrade to Premium to get 40 messages/month and longer, more personal responses. Founders discount is available for a limited time.</p>
            <div className="flex gap-3">
              <a href="https://buymeacoffee.com/yaltech" target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors">Upgrade to Premium</a>
              <button onClick={() => setShowUpsell(false)} className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">Maybe later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 