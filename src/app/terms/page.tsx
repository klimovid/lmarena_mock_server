/**
 * Terms of Service Page
 * Mock terms of service for Arena API
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Arena API',
  description: 'Terms and conditions for using Arena API',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
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
              Welcome to Arena API. By accessing or using our mock API service, you agree to be bound 
              by these Terms of Service ("Terms"). Please read them carefully before using our service.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Arena API, you accept and agree to be bound by the terms and 
              provisions of this agreement. If you do not agree to these Terms, please do not use 
              our service.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Service Description
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                Arena API is a mock API service designed for development and testing purposes. 
                We provide:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Mock endpoints for chat and messaging functionality</li>
                <li>Sample data for testing integrations</li>
                <li>API documentation and examples</li>
                <li>Development environment simulation</li>
              </ul>
              <p className="leading-relaxed mt-3">
                <strong>Note:</strong> This is a mock service. Data is not persistent and may be 
                reset at any time.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. User Responsibilities
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">You agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the service only for lawful purposes</li>
                <li>Not attempt to abuse or overload our systems</li>
                <li>Not reverse engineer or exploit the service</li>
                <li>Not share API keys or credentials</li>
                <li>Respect rate limits and usage guidelines</li>
                <li>Not use the service for production workloads</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Usage Limits and Restrictions
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                We reserve the right to impose reasonable limits on your use of the service:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Rate limiting: Maximum 100 requests per minute</li>
                <li>Session limits: Data retention for 30 days maximum</li>
                <li>Data storage: 1GB per user account</li>
                <li>API calls: 10,000 requests per month (free tier)</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Exceeding these limits may result in temporary suspension of access.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All content, features, and functionality of Arena API, including but not limited to 
              software, code, designs, and documentation, are owned by us and protected by 
              international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Disclaimer of Warranties
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed font-semibold">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
              </p>
              <p className="leading-relaxed">
                We explicitly disclaim all warranties, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Warranties of merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Uninterrupted or error-free service</li>
                <li>Security or accuracy of data</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL ARENA API BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT 
              LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES, ARISING FROM:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4 text-gray-700">
              <li>Your use or inability to use the service</li>
              <li>Unauthorized access to your data</li>
              <li>Errors or omissions in the service</li>
              <li>Third-party conduct or content</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Indemnification
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless Arena API and its affiliates from any claims, 
              damages, losses, liabilities, and expenses arising from your use of the service or 
              violation of these Terms.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Service Modifications
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the service at any time without 
              notice. We may also update these Terms periodically. Continued use after changes 
              constitutes acceptance of modified Terms.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Termination
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                We may terminate or suspend your access immediately, without prior notice, for any 
                reason, including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Violation of these Terms</li>
                <li>Abusive or harmful behavior</li>
                <li>Fraudulent activity</li>
                <li>Extended inactivity</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Upon termination, your right to use the service ceases immediately.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the 
              State of California, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Dispute Resolution
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Any disputes arising from these Terms or use of the service shall be resolved through 
              binding arbitration in San Francisco, California, in accordance with the rules of the 
              American Arbitration Association.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Severability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining 
              provisions shall continue in full force and effect.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Entire Agreement
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms constitute the entire agreement between you and Arena API regarding the 
              service and supersede all prior agreements and understandings.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. Contact Information
            </h2>
            <div className="text-gray-700 space-y-2">
              <p className="leading-relaxed">
                For questions about these Terms, contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-md space-y-1">
                <p><strong>Email:</strong> legal@arena-api.com</p>
                <p><strong>Address:</strong> 123 Tech Street, San Francisco, CA 94105</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-4">
          <a href="/" className="text-blue-600 hover:underline">
            Back to Home
          </a>
          <span className="text-gray-400">•</span>
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
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

