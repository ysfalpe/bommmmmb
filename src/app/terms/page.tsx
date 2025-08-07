import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <nav className="max-w-4xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ChristianAI</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <div className="prose prose-slate max-w-none">
          <p>
            By accessing or using ChristianAI, you agree to these Terms. If you do not agree, do not use the service.
          </p>

          <h2>1. Service</h2>
          <p>
            ChristianAI provides AI-generated pastoral conversation and spiritual guidance for informational and devotional purposes only.
            It is not a substitute for professional counseling, therapy, medical, legal, or financial advice.
          </p>

          <h2>2. Acceptable use</h2>
          <ul>
            <li>No unlawful, abusive, hateful, harassing, or spam content.</li>
            <li>No attempts to attack, disrupt, or reverse engineer the service.</li>
            <li>Respect usage limits and rate limits. Automated scraping or excessive requests are prohibited.</li>
          </ul>

          <h2>3. Accounts and Premium</h2>
          <ul>
            <li>Premium provides additional message quota and experience. Quotas may change for reliability or abuse prevention.</li>
            <li>Codes/tokens are personal and must not be shared or resold.</li>
            <li>We may suspend access for suspected abuse, fraud, or policy violations.</li>
          </ul>

          <h2>4. Payments and refunds</h2>
          <ul>
            <li>Payments are processed by third‑party providers (e.g., Buy Me a Coffee). We do not store card details.</li>
            <li>Premium activation typically occurs within 24 hours after purchase via a code delivered to you.</li>
            <li>Refunds are considered only for non‑delivery or technical inability to access the service after reasonable troubleshooting.</li>
          </ul>

          <h2>5. Intellectual property</h2>
          <p>
            The site, branding, UI, and content are owned by us or our licensors. You receive a limited, non‑exclusive
            license to use the service for personal, non‑commercial purposes.
          </p>

          <h2>6. Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND. AI OUTPUT MAY BE INACCURATE OR INCOMPLETE.
            YOU USE THE SERVICE AT YOUR OWN RISK.
          </p>

          <h2>7. Limitation of liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL.
          </p>

          <h2>8. Changes</h2>
          <p>
            We may update these Terms or the service at any time. If material changes occur, we will post a notice.
            Continued use after changes means acceptance.
          </p>

          <h2>9. Governing law</h2>
          <p>
            These Terms are governed by the laws applicable in your country/region, excluding conflict of law rules.
          </p>

          <h2>10. Contact</h2>
          <p>
            For questions about these Terms, contact us via the <Link href="/contact" className="text-blue-600">contact</Link> page.
          </p>

          <p className="text-sm text-gray-500 mt-6">
            By using ChristianAI, you also agree to our <Link href="/privacy" className="text-blue-600">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}


