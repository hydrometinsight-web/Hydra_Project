import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for HydroMetInsight - Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-gray-600 hover:text-[#93D419] mb-4 inline-block text-sm transition-colors">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 text-sm">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 prose prose-sm max-w-none" style={{ textAlign: 'inherit' }}>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            HydroMetInsight ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Information You Provide</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li><strong>Newsletter Subscription:</strong> Email address when you subscribe to our newsletter</li>
            <li><strong>Comments:</strong> Name, email address, and comment content when you post comments on articles</li>
            <li><strong>Contact Forms:</strong> Name, email, and message content when you contact us</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li><strong>Usage Data:</strong> Page views, browsing patterns, and interaction data</li>
            <li><strong>Device Information:</strong> IP address, browser type, device type, and operating system</li>
            <li><strong>Location Data:</strong> Country-level location data based on IP address</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We use the information we collect to:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Send newsletter emails with industry updates and research insights</li>
            <li>Moderate and display comments on articles</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Analyze website usage and improve our content and services</li>
            <li>Comply with legal obligations and protect our rights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We do not sell your personal information. We may share your information only in the following circumstances:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our website</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights (GDPR)</h2>
          <p className="text-gray-700 leading-relaxed mb-3">If you are located in the European Economic Area (EEA), you have the following rights:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
            <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
            <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            To exercise these rights, please contact us at the email address provided below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Newsletter and Email Communications</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            When you subscribe to our newsletter, you consent to receive email communications from us. You can unsubscribe at any time by:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Clicking the unsubscribe link in any newsletter email</li>
            <li>Contacting us directly at the email address below</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We use cookies and similar tracking technologies to track activity on our website. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Email:</strong> privacy@hydrometinsight.com<br />
            <strong>Website:</strong> <Link href="/" className="text-[#93D419] hover:text-[#7fb315]">www.hydrometinsight.com</Link>
          </p>
        </section>
      </div>
    </div>
  )
}

