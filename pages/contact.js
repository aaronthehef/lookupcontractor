import Head from 'next/head'
import Link from 'next/link'

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us - Free Contractor License Verification Support | Lookup Contractor</title>
        <meta name="description" content="Contact Lookup Contractor for support with contractor license verification, questions about our free service, or business inquiries. Get help verifying contractor credentials." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://lookupcontractor.com/contact" />
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

            <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>Contact Us</h1>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
              We'd love to hear from you! Get in touch with questions, feedback, or business inquiries.
            </p>

            <div style={{ lineHeight: '1.8', color: '#333' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                {/* General Contact */}
                <div style={{ 
                  background: '#f8f9ff', 
                  border: '1px solid #e0e7ff', 
                  borderRadius: '12px', 
                  padding: '2rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#3b82f6', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    📧 General Inquiries
                  </h2>
                  <p style={{ marginBottom: '1rem', color: '#555' }}>
                    For general questions about our service, data accuracy, or website functionality.
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:contact@lookupcontractor.com" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                      contact@lookupcontractor.com
                    </a>
                  </p>
                  <p style={{ marginBottom: 0, fontSize: '0.9rem', color: '#666' }}>
                    We typically respond within 24-48 hours
                  </p>
                </div>

                {/* Technical Support */}
                <div style={{ 
                  background: '#f0fdf4', 
                  border: '1px solid #bbf7d0', 
                  borderRadius: '12px', 
                  padding: '2rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#16a34a', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    🔧 Technical Support
                  </h2>
                  <p style={{ marginBottom: '1rem', color: '#555' }}>
                    Experiencing issues with the website? Need help with search functionality?
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:contact@lookupcontractor.com" style={{ color: '#16a34a', textDecoration: 'underline' }}>
                      contact@lookupcontractor.com
                    </a>
                  </p>
                  <p style={{ marginBottom: 0, fontSize: '0.9rem', color: '#666' }}>
                    Please include details about your browser and the issue
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                {/* Business Inquiries */}
                <div style={{ 
                  background: '#fefce8', 
                  border: '1px solid #fde047', 
                  borderRadius: '12px', 
                  padding: '2rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#ca8a04', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    💼 Business Inquiries
                  </h2>
                  <p style={{ marginBottom: '1rem', color: '#555' }}>
                    Interested in data licensing, partnerships, or API access?
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:contact@lookupcontractor.com" style={{ color: '#ca8a04', textDecoration: 'underline' }}>
                      contact@lookupcontractor.com
                    </a>
                  </p>
                  <p style={{ marginBottom: 0, fontSize: '0.9rem', color: '#666' }}>
                    Please include details about your use case and requirements
                  </p>
                </div>

                {/* Legal & Compliance */}
                <div style={{ 
                  background: '#fdf2f8', 
                  border: '1px solid #fbcfe8', 
                  borderRadius: '12px', 
                  padding: '2rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#be185d', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    ⚖️ Legal & Compliance
                  </h2>
                  <p style={{ marginBottom: '1rem', color: '#555' }}>
                    Copyright issues, DMCA requests, or privacy concerns?
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:contact@lookupcontractor.com" style={{ color: '#be185d', textDecoration: 'underline' }}>
                      contact@lookupcontractor.com
                    </a>
                  </p>
                  <p style={{ marginBottom: 0, fontSize: '0.9rem', color: '#666' }}>
                    Please include all relevant documentation
                  </p>
                </div>
              </div>

              <h2 style={{ fontSize: '1.8rem', marginTop: '3rem', marginBottom: '1rem', color: '#333' }}>
                Frequently Asked Questions
              </h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
                  Q: Why is some contractor information outdated?
                </h3>
                <p style={{ marginBottom: '1rem', paddingLeft: '1rem' }}>
                  Our data comes from publicly available government records. There may be delays between 
                  when information changes in official records and when it appears on our site. Always 
                  verify information directly with the{' '}
                  <a href="https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx" 
                     target="_blank" rel="noopener noreferrer" 
                     style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    CSLB official database
                  </a>.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
                  Q: Can I update or remove my business information?
                </h3>
                <p style={{ marginBottom: '1rem', paddingLeft: '1rem' }}>
                  We display information as it appears in public government records. To update your 
                  official licensing information, contact the CSLB directly. If there are specific 
                  issues with how we display your public information, please contact us.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
                  Q: Do you provide an API for accessing contractor data?
                </h3>
                <p style={{ marginBottom: '1rem', paddingLeft: '1rem' }}>
                  We don't currently offer a public API. For businesses interested in bulk data access 
                  or API services, please contact us at{' '}
                  <a href="mailto:contact@lookupcontractor.com" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    contact@lookupcontractor.com
                  </a>.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
                  Q: How often is your database updated?
                </h3>
                <p style={{ marginBottom: '1rem', paddingLeft: '1rem' }}>
                  We update our database periodically to reflect changes in official licensing records. 
                  The frequency varies, but we strive to keep information as current as possible while 
                  respecting the terms of service of our data sources.
                </p>
              </div>

              <h2 style={{ fontSize: '1.8rem', marginTop: '3rem', marginBottom: '1rem', color: '#333' }}>
                Response Times
              </h2>
              <ul style={{ paddingLeft: '2rem', marginBottom: '2rem' }}>
                <li><strong>General inquiries:</strong> 24-48 hours</li>
                <li><strong>Technical support:</strong> 24-48 hours</li>
                <li><strong>Business inquiries:</strong> 2-3 business days</li>
                <li><strong>Legal matters:</strong> 3-5 business days</li>
              </ul>

              <div style={{ 
                background: '#e0f2fe', 
                border: '1px solid '#b3e5fc', 
                borderRadius: '8px', 
                padding: '1.5rem', 
                marginTop: '2rem'
              }}>
                <h3 style={{ color: '#0277bd', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  💡 Before You Contact Us
                </h3>
                <p style={{ color: '#0277bd', marginBottom: '0.5rem' }}>
                  For the fastest resolution:
                </p>
                <ul style={{ color: '#0277bd', paddingLeft: '1.5rem', marginBottom: 0 }}>
                  <li>Check our <Link href="/disclaimer" style={{ color: '#0277bd', textDecoration: 'underline' }}>Disclaimer</Link> and <Link href="/data-sources" style={{ color: '#0277bd', textDecoration: 'underline' }}>Data Sources</Link> pages</li>
                  <li>Try searching with different keywords or spellings</li>
                  <li>Verify information directly with the CSLB when possible</li>
                  <li>Include specific details about any issues you're experiencing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}