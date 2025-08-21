'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <div className="min-h-screen bg-white">
      {/* AdSense Script - Only for non-premium users */}
      {!isPremium && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8992984801647508"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      {/* Navigation Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-lg font-bold">✝</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ChristianAI</span>
            </div>
            
            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 cursor-pointer active:scale-95"
              >
                Features
              </button>
              <button 
                onClick={() => {
                  document.getElementById('testimonials')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 cursor-pointer active:scale-95"
              >
                Stories
              </button>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">Pricing</Link>
              <button 
                onClick={() => window.open('/resources/CSB_Bible.pdf', '_blank')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 cursor-pointer active:scale-95"
              >
                Bible
              </button>
              <a
                href="https://buymeacoffee.com/yaltech"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-all duration-300 hover:shadow-md hover:scale-105"
                title="Founders discount • 40 messages/month"
              >
                Premium
              </a>
              <Link href="/chat" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                Try Now
              </Link>
            </div>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </nav>
        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/90 backdrop-blur px-6 py-4 space-y-3">
            <button onClick={() => { setMobileOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="block w-full text-left text-gray-700">Features</button>
            <button onClick={() => { setMobileOpen(false); document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="block w-full text-left text-gray-700">Stories</button>
              <Link onClick={() => setMobileOpen(false)} href="/pricing" className="block text-gray-700">Pricing</Link>
            <button onClick={() => { setMobileOpen(false); window.open('/resources/CSB_Bible.pdf', '_blank'); }} className="block w-full text-left text-gray-700">Bible</button>
            <Link onClick={() => setMobileOpen(false)} href="/chat" className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold">Try Now</Link>
            <a onClick={() => setMobileOpen(false)} href="https://buymeacoffee.com/yaltech" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-amber-500 text-white px-4 py-3 rounded-xl font-semibold">Premium</a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        {/* Modern geometric background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center space-y-6">
            
            {/* Badges */}
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-gray-300 shadow-md">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">24/7 Available • Always Listening</span>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-amber-50 rounded-full border border-amber-200 text-amber-700 shadow-sm">
                <span className="text-sm font-medium">Founders Discount: 40% Off • Limited Time</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Your Personal
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Pastor
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Get spiritual guidance, prayer support, and Biblical wisdom whenever you need it. 
                <span className="font-semibold text-gray-700">No appointments. No judgment. Just faith.</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <div className="flex flex-col items-center">
                <Link href="/chat" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <span>Start Your Conversation</span>
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Link>
                <div className="mt-1 text-[11px] sm:text-xs text-white/90">By clicking, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy</Link>.</div>
              </div>
              <a
                href="https://buymeacoffee.com/yaltech"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-4 bg-amber-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Activate Premium
              </a>
              <button 
                onClick={() => {
                  document.getElementById('testimonials')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="inline-flex items-center px-6 py-4 bg-white/80 backdrop-blur-md text-gray-700 font-medium rounded-2xl border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer active:scale-95"
              >
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m0 0l7-7m0 0l7 7"></path>
                </svg>
                See How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div id="features" className="pt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                <div className="group p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Scripture-Based</h3>
                  <p className="text-sm text-gray-600">Rooted in Biblical wisdom and Christian teachings</p>
                </div>
                
                <div className="group p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Private & Secure</h3>
                  <p className="text-sm text-gray-600">Your conversations are confidential and safe</p>
                </div>
                
                <div className="group p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Always Available</h3>
                  <p className="text-sm text-gray-600">Day or night, whenever you need guidance</p>
                </div>

                <div className="group p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
                     onClick={() => window.open('/resources/CSB_Bible.pdf', '_blank')}>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Read the Bible</h3>
                  <p className="text-sm text-gray-600">Complete Bible available as downloadable PDF</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-slate-50" id="testimonials">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
              </svg>
              Loved by believers worldwide
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transforming 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> spiritual journeys</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands who have found comfort, wisdom, and deeper faith through our AI pastor
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center mr-4 shadow-md">
                    <span className="text-lg font-bold text-white">S</span>
                </div>
                <div>
                    <div className="font-semibold text-gray-900">Sarah Chen</div>
                    <div className="text-sm text-gray-500">Youth Pastor</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed">
                  "This AI pastor has been a game-changer for late-night prayer sessions with our youth. The Biblical accuracy and pastoral care is remarkable."
                </blockquote>
                <div className="flex text-yellow-400 text-sm mt-4">
                  ★★★★★
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mr-4 shadow-md">
                    <span className="text-lg font-bold text-white">M</span>
                </div>
                <div>
                    <div className="font-semibold text-gray-900">Marcus Johnson</div>
                    <div className="text-sm text-gray-500">Seminary Student</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed">
                  "As someone studying theology, I'm impressed by the depth of Biblical knowledge and the compassionate responses. It's like having a mentor available 24/7."
                </blockquote>
                <div className="flex text-yellow-400 text-sm mt-4">
                  ★★★★★
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mr-4 shadow-md">
                    <span className="text-lg font-bold text-white">E</span>
                </div>
                <div>
                    <div className="font-semibold text-gray-900">Emma Rodriguez</div>
                    <div className="text-sm text-gray-500">Working Mom</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed">
                  "Between work and kids, finding time for spiritual guidance was impossible. Now I can get prayer support and Biblical wisdom anytime I need it."
                </blockquote>
                <div className="flex text-yellow-400 text-sm mt-4">
                  ★★★★★
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Begin Your
            <span className="block">Spiritual Journey?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your AI pastor is waiting with open arms. Get instant spiritual guidance, Biblical wisdom, and prayer support whenever you need it.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/chat" className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span>Start Your Conversation Now</span>
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </a>
            
            <div className="flex items-center text-blue-100 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Available 24/7 • No signup required
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/20 mt-12">
            <blockquote className="text-2xl md:text-3xl text-white/90 font-light italic mb-4">
              "Come to me, all you who are weary and burdened, and I will give you rest."
          </blockquote>
            <cite className="text-lg text-blue-200 font-medium">
              Matthew 11:28
          </cite>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">✝</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ChristianAI</span>
                <p className="text-sm text-slate-500">AI pastoral care with Biblical wisdom</p>
              </div>
            </div>
            
            <div className="flex space-x-8 text-sm">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-500">
            <p>Built with faith, love, and cutting-edge AI technology. © 2024 ChristianAI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
