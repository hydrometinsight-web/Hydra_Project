import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for HydroMetInsight - Read our terms and conditions for using our website and services.',
}

export default function TermsPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-gray-600 hover:text-[#93D419] mb-4 inline-block text-sm transition-colors">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 text-sm">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 prose prose-sm max-w-none" style={{ textAlign: 'inherit' }}>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing and using HydroMetInsight ("the Website"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of the Website</h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Permitted Use</h3>
          <p className="text-gray-700 leading-relaxed mb-3">You may use our website for:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Reading and accessing content for personal, non-commercial purposes</li>
            <li>Subscribing to our newsletter</li>
            <li>Posting comments on articles (subject to moderation)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Prohibited Activities</h3>
          <p className="text-gray-700 leading-relaxed mb-3">You agree not to:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Use the website for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to any part of the website</li>
            <li>Transmit any viruses, malware, or harmful code</li>
            <li>Copy, reproduce, or redistribute content without permission</li>
            <li>Use automated systems to scrape or collect data from the website</li>
            <li>Post spam, offensive, or defamatory content in comments</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            All content on this website, including articles, images, logos, and design elements, is the property of HydroMetInsight or its content providers and is protected by copyright and other intellectual property laws.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You may not reproduce, distribute, modify, or create derivative works from our content without explicit written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User-Generated Content</h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Comments</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            When you post comments on our website, you grant us a non-exclusive, royalty-free license to use, display, and moderate your comments. You are responsible for the content you post and agree that:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Your comments do not violate any third-party rights</li>
            <li>Your comments are not defamatory, offensive, or illegal</li>
            <li>You have the right to post the content</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to moderate, edit, or remove any comments that violate these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Disclaimer of Warranties</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            The information on this website is provided "as is" without warranties of any kind, either express or implied. We do not warrant that:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>The website will be available at all times or free from errors</li>
            <li>The content is accurate, complete, or up-to-date</li>
            <li>The website is free from viruses or other harmful components</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            To the fullest extent permitted by law, HydroMetInsight shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Indemnification</h2>
          <p className="text-gray-700 leading-relaxed">
            You agree to indemnify and hold harmless HydroMetInsight, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the website or violation of these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Links</h2>
          <p className="text-gray-700 leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these external sites. Your use of third-party websites is at your own risk.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Newsletter Subscription</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            By subscribing to our newsletter, you consent to receive email communications from us. You can unsubscribe at any time using the link provided in each email or by contacting us directly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Modifications to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on this page. Your continued use of the website after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to terminate or suspend your access to the website at any time, without prior notice, for any violation of these Terms of Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Email:</strong> legal@hydrometinsight.com<br />
            <strong>Website:</strong> <Link href="/" className="text-[#93D419] hover:text-[#7fb315]">www.hydrometinsight.com</Link>
          </p>
        </section>
      </div>
    </div>
  )
}

