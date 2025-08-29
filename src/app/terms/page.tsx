import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">✞</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChristianAI
              </span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/chat" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Chat
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 lg:px-8 pt-24 pb-16">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-gray-200 p-8 md:p-12 shadow-xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By accessing and using ChristianAI, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use License</h2>
            <p className="text-gray-600 mb-6">
              Permission is granted to temporarily use ChristianAI for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Guidelines</h2>
            <p className="text-gray-600 mb-6">
              Our AI chat service is designed to provide spiritual guidance and support. 
              Please use the service respectfully and in accordance with Christian values.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitations</h2>
            <p className="text-gray-600 mb-6">
              In no event shall ChristianAI or its suppliers be liable for any damages 
              arising out of the use or inability to use the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Revisions</h2>
            <p className="text-gray-600 mb-6">
              ChristianAI may revise these terms of service at any time without notice. 
              By using this service you are agreeing to be bound by the current version of these terms.
            </p>

            <div className="text-center mt-12">
              <Link 
                href="/" 
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}