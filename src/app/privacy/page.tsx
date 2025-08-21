'use client';
import Link from 'next/link';
import Script from 'next/script';
import { useState, useEffect } from 'react';

export default function PrivacyPage() {
  const [isPremium, setIsPremium] = useState(false);

  // Check if user is premium
  useEffect(() => {
    const savedToken = localStorage.getItem('premiumToken');
    if (savedToken) {
      try {
        // Try to parse as base64 JSON first (legacy)
        let decoded: { premium?: boolean } | null = null;
        try {
          decoded = JSON.parse(atob(savedToken)) as { premium?: boolean };
        } catch {
          // If not base64 JSON, assume JWT and parse payload
          const payload = JSON.parse(atob(savedToken.split('.')[1])) as { premium?: boolean };
          decoded = payload;
        }
        setIsPremium(decoded?.premium === true);
      } catch {
        // Invalid token, remove it
        localStorage.removeItem('premiumToken');
      }
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* AdSense Script - Only for non-premium users */}
      {!isPremium && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8992984801647508"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <nav className="max-w-4xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ChristianAI</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <div className="prose prose-slate max-w-none">
          <p>
            We respect your privacy. This Privacy Policy explains what personal data we collect, how we use it,
            and the choices you have. By using ChristianAI, you agree to this policy.
          </p>

          <h2>1. Data we process</h2>
          <ul>
            <li><strong>Conversation content</strong>: Your messages to the AI and the AI responses.</li>
            <li><strong>Technical data</strong>: IP address, device/browser info, timestamps, and diagnostics strictly for abuse prevention, rate limiting, and reliability.</li>
            <li><strong>Premium data</strong>: A token that indicates your plan type and remaining messages. We do not store your payment card details.</li>
          </ul>

          <h2>2. How we use data</h2>
          <ul>
            <li>To operate the chat service and generate responses.</li>
            <li>To enforce usage limits (free and premium) and prevent abuse/spam.</li>
            <li>To improve stability, security, and user experience.</li>
          </ul>

          <h2>3. Sharing</h2>
          <p>
            We may share data with infrastructure providers who power our service (e.g., hosting, AI model API, rate-limit database)
            only to the extent necessary to operate the product. We do not sell personal data.
          </p>

          <h2>4. AI responses</h2>
          <p>
            AI-generated content may be imperfect or incomplete. Do not rely on it for medical, legal, financial,
            or safety-critical advice. Use discretion and consult qualified professionals when needed.
          </p>

          <h2>5. Security</h2>
          <p>
            We apply reasonable technical and organizational measures to protect data. No online service can be 100% secure.
          </p>

          <h2>6. Data retention</h2>
          <p>
            Conversation content may be retained for a limited time to operate and improve reliability, then deleted or anonymized.
            Diagnostic logs are kept for a limited period for security and troubleshooting.
          </p>

          <h2>7. Your choices</h2>
          <ul>
            <li>You may limit what you share in conversations.</li>
            <li>You may request deletion of stored conversation data where applicable by contacting us.</li>
          </ul>

          <h2>8. Children</h2>
          <p>
            The service is not directed to children under 13 (or the age required by your local law).
          </p>

          <h2>9. Contact</h2>
          <p>
            For privacy questions or requests, contact us via the <Link href="/contact" className="text-blue-600">contact</Link> link.
          </p>

          <p className="text-sm text-gray-500 mt-6">
            By using ChristianAI, you acknowledge this Privacy Policy. For terms governing your use, see our{' '}
            <Link href="/terms" className="text-blue-600">Terms of Use</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}



