import Head from 'next/head'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - How We Protect Your Data | Lookup Contractor</title>
        <meta name="description" content="Privacy Policy for our free contractor license verification service. Learn how we collect, use, and protect your personal information when checking contractor credentials." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://lookupcontractor.com/privacy-policy" />
      </Head>
      
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {/* Header */}
        <header style={{ padding: '2rem 0', textAlign: 'center', color: 'white' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', margin: 0 }}>
              L<span style={{ 
                display: 'inline-block',
                fontSize: '2rem',
                filter: 'hue-rotate(200deg) saturate(1.5)',
                transform: 'scale(1.05)',
                marginLeft: '2px',
                marginRight: '2px'
              }}>👀</span>kup Contractor
            </h1>
          </Link>
        </header>

        {/* Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem 4rem 2rem' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '3rem', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '1rem' }}>
                ← Back to Home
              </Link>
            </div>

            <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>Privacy Policy</h1>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem' }}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div style={{ lineHeight: '1.8', color: '#333' }}>
              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                1. Information We Collect
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Public Contractor Data:</strong> We display publicly available contractor licensing information 
                obtained from state licensing boards, including business names, license numbers, addresses, phone numbers, 
                license status, and classifications.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Usage Data:</strong> We automatically collect certain information when you visit our site, including 
                your IP address, browser type, device information, pages visited, and search queries to improve our services.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Cookies:</strong> We use cookies and similar technologies to enhance your browsing experience, 
                remember your preferences, and analyze site usage.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                2. How We Use Your Information
              </h2>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>Provide contractor search and verification services</li>
                <li>Improve website functionality and user experience</li>
                <li>Analyze usage patterns to enhance our services</li>
                <li>Ensure site security and prevent abuse</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                3. Information Sharing
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                We do not sell, trade, or otherwise transfer your personal information to third parties, except:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>When required by law or legal process</li>
                <li>To protect our rights, property, or safety</li>
                <li>With service providers who assist in operating our website (under strict confidentiality agreements)</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                4. Cookies and Tracking
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                We use the following types of cookies:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
              </ul>
              <p style={{ marginBottom: '1rem' }}>
                You can control cookies through your browser settings, but disabling certain cookies may limit site functionality.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                5. Data Security
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                We implement appropriate security measures to protect your information against unauthorized access, 
                alteration, disclosure, or destruction. However, no internet transmission is 100% secure.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                6. Your Rights
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                You have the right to:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>Access information we have about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information (where legally permissible)</li>
                <li>Opt-out of certain data collection and processing</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                7. Children's Privacy
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                Our services are not intended for children under 13. We do not knowingly collect personal information 
                from children under 13 years of age.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                8. Changes to This Policy
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                We may update this Privacy Policy from time to time. We will notify users of any material changes 
                by posting the new policy on this page with an updated "Last Updated" date.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                9. Contact Us
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                If you have questions about this Privacy Policy, please contact us at{' '}
                <Link href="/contact" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                  our contact page
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}