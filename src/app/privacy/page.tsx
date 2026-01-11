/**
 * Privacy Policy Page
 * Mock privacy policy for Arena API
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Arena API',
  description: 'Learn how Arena API handles and protects your data',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mt-2">
            Last updated: January 11, 2026
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              Arena API ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you use our mock API service.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  1.1 Information You Provide
                </h3>
                <p className="leading-relaxed">
                  We collect information that you voluntarily provide when using our service, including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Chat messages and prompts</li>
                  <li>User preferences and settings</li>
                  <li>Feedback and ratings</li>
                  <li>Session data and cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  1.2 Automatically Collected Information
                </h3>
                <p className="leading-relaxed">
                  When you access our API, we automatically collect:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>IP addresses and device information</li>
                  <li>Browser type and version</li>
                  <li>Usage statistics and analytics</li>
                  <li>API request/response metadata</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">We use collected information to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide and maintain our mock API service</li>
                <li>Improve user experience and functionality</li>
                <li>Generate usage analytics and insights</li>
                <li>Detect and prevent technical issues</li>
                <li>Comply with legal obligations</li>
                <li>Communicate updates and changes</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Data Sharing and Disclosure
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                We do not sell your personal information. We may share data with:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Service Providers:</strong> Third-party vendors who help us operate our service
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with merger, acquisition, or asset sale
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4 text-gray-700">
              <li>Encryption in transit (HTTPS/TLS)</li>
              <li>Secure server infrastructure</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              However, no method of transmission over the Internet is 100% secure, and we cannot 
              guarantee absolute security.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your information only as long as necessary to provide our services and 
              comply with legal obligations. Session data and mock conversations are typically 
              stored for 30 days unless you request deletion.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Your Rights
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Export your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="leading-relaxed mt-3">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@arena-api.com" className="text-blue-600 hover:underline">
                  privacy@arena-api.com
                </a>
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to maintain sessions and improve 
              user experience. You can control cookies through your browser settings.
            </p>
            <div className="mt-3 space-y-2 text-gray-700">
              <p><strong>Essential Cookies:</strong> Required for service functionality</p>
              <p><strong>Analytics Cookies:</strong> Help us understand usage patterns</p>
              <p><strong>Preference Cookies:</strong> Remember your settings</p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under 13. We do not knowingly collect 
              personal information from children. If you believe we have collected data from 
              a child, please contact us immediately.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your data in accordance with 
              this Privacy Policy.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant 
              changes by posting the new policy on this page and updating the "Last updated" date. 
              Continued use of our service after changes constitutes acceptance.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Contact Us
            </h2>
            <div className="text-gray-700 space-y-2">
              <p className="leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-md space-y-1">
                <p><strong>Email:</strong> privacy@arena-api.com</p>
                <p><strong>Address:</strong> 123 Tech Street, San Francisco, CA 94105</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </div>
          </section>

          {/* GDPR Notice */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              EU/UK Users (GDPR)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you are located in the European Union or United Kingdom, you have additional rights 
              under GDPR, including the right to lodge a complaint with a supervisory authority. 
              Our lawful basis for processing includes consent, contractual necessity, and legitimate interests.
            </p>
          </section>

          {/* California Notice */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              California Residents (CCPA)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              California residents have the right to request disclosure of data collected and the right 
              to request deletion. We do not sell personal information. For CCPA requests, email{' '}
              <a href="mailto:privacy@arena-api.com" className="text-blue-600 hover:underline">
                privacy@arena-api.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-4">
          <a href="/" className="text-blue-600 hover:underline">
            Back to Home
          </a>
          <span className="text-gray-400">•</span>
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>
          <span className="text-gray-400">•</span>
          <a href="/api/v1/health" className="text-blue-600 hover:underline">
            API Status
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2026 Arena API. All rights reserved.</p>
          <p className="mt-1">
            This is a mock API service for development and testing purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}

