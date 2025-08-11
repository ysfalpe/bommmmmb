'use client';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">✝</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ChristianAI</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/chat" className="text-gray-600 hover:text-gray-900 font-medium">Try</Link>
              <Link href="/pricing" className="text-gray-900 font-semibold">Pricing</Link>
              <a
                href="https://buymeacoffee.com/yaltech"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-all"
              >
                Get Premium
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-amber-50 rounded-full border border-amber-200 text-amber-700 mb-4">Founders Discount: 40% Off • Limited Time</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose your path</h1>
          <p className="text-gray-600 text-lg">Start free, upgrade anytime. Instant activation, cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Free</h2>
              <span className="text-sm text-blue-600">Start now</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
            <div className="text-gray-500 mb-6">forever</div>
            <ul className="space-y-3 text-gray-700">
              <li>• 5 messages per month</li>
              <li>• Warm, Scripture-based guidance</li>
              <li>• Always-on availability</li>
            </ul>
            <Link href="/chat" className="mt-6 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Start Free</Link>
          </div>

          {/* Premium card */}
          <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-md p-6 relative">
            <div className="absolute -top-3 right-4 inline-flex items-center px-3 py-1 bg-amber-500 text-white text-xs rounded-full shadow">Most Popular</div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Premium</h2>
              <span className="text-sm text-amber-600">Founders -40%</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">$15</div>
            <div className="text-gray-500 mb-6">per month</div>
            <ul className="space-y-3 text-gray-700">
              <li>• 40 messages per month</li>
              <li>• Deeper, longer, more personal guidance</li>
              <li>• Priority processing</li>
              <li>• Instant activation after code entry</li>
            </ul>
            <a
              href="https://buymeacoffee.com/yaltech"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600"
            >
              Get Premium Code
            </a>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How Premium works</h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Click “Get Premium Code” and complete the purchase on Buy Me a Coffee.</li>
            <li>Within 24 hours, you’ll receive your Premium code via email/DM.</li>
            <li>Go to the chat page → click “I have a code” → paste the code and activate.</li>
            <li>Instant activation. Your monthly quota starts immediately (40 messages).</li>
          </ol>
          <p className="text-sm text-gray-500 mt-3">Notes: Your conversations are private. You can cancel anytime. Founders discount is time-limited.</p>
        </div>

        {/* Free vs Premium quick table */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Free vs Premium</h3>
          <div className="grid md:grid-cols-3 gap-4 text-gray-700">
            <div>
              <div className="font-semibold mb-2">Messages</div>
              <div>Free: 5/month</div>
              <div>Premium: 40/month</div>
            </div>
            <div>
              <div className="font-semibold mb-2">Guidance depth</div>
              <div>Free: concise answers</div>
              <div>Premium: deeper, longer, personal</div>
            </div>
            <div>
              <div className="font-semibold mb-2">Priority</div>
              <div>Free: standard</div>
              <div>Premium: priority processing</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-sm text-center">
          Built with faith, love, and AI • © 2024 ChristianAI
        </div>
      </footer>
    </div>
  );
}


