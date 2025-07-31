import Head from 'next/head'
import Link from 'next/link'

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer - Contractor License Verification Limitations | Lookup Contractor</title>
        <meta name="description" content="Important disclaimers about contractor license verification data accuracy, liability, and proper use. Always verify contractor credentials independently before hiring." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://lookupcontractor.com/disclaimer" />
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

            <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>Disclaimer</h1>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem' }}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div style={{ 
              background: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '8px', 
              padding: '1.5rem', 
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: '#856404', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                ⚠️ Important Notice
              </h3>
              <p style={{ color: '#856404', marginBottom: 0, fontSize: '1rem' }}>
                Please read this disclaimer carefully before using our contractor lookup service. 
                This information is crucial for making informed decisions about contractor selection.
              </p>
            </div>

            <div style={{ lineHeight: '1.8', color: '#333' }}>
              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Data Accuracy and Currency
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Information May Be Outdated:</strong> The contractor information displayed on this website 
                is obtained from publicly available sources, primarily state licensing boards. While we make 
                reasonable efforts to keep this information current, we cannot guarantee that all data is 
                up-to-date, accurate, or complete.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Always Verify Independently:</strong> Before hiring any contractor, you should always 
                verify their license status, insurance, and credentials directly with the appropriate state 
                licensing board and insurance providers.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                No Endorsement or Recommendation
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                The inclusion of a contractor's information in our database does <strong>NOT</strong> constitute:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>An endorsement or recommendation of their services</li>
                <li>A guarantee of their work quality, reliability, or trustworthiness</li>
                <li>Verification of their current insurance or bonding status</li>
                <li>Confirmation of their ability to perform specific types of work</li>
                <li>Any assessment of their business practices or customer satisfaction</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Due Diligence Requirements
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                Before hiring any contractor, you should perform your own due diligence, including:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li><strong>License Verification:</strong> Confirm current license status with the state licensing board</li>
                <li><strong>Insurance Verification:</strong> Verify current liability and workers' compensation insurance</li>
                <li><strong>References:</strong> Request and contact recent customer references</li>
                <li><strong>Written Estimates:</strong> Obtain detailed written estimates from multiple contractors</li>
                <li><strong>Background Check:</strong> Research the contractor's business history and any complaints</li>
                <li><strong>Legal Compliance:</strong> Ensure they comply with local building codes and permit requirements</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Limitation of Liability
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                Lookup Contractor and its operators shall not be liable for:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>Any damages or losses resulting from the use of information on this site</li>
                <li>Inaccurate, outdated, or incomplete contractor information</li>
                <li>The performance, quality, or conduct of any contractor listed in our database</li>
                <li>Any disputes between users and contractors</li>
                <li>Any financial losses related to contractor selection or services</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Not Legal or Professional Advice
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                The information provided on this website is for informational purposes only and should not be 
                construed as legal, professional, or expert advice. We are not attorneys, contractors, or 
                construction professionals, and we do not provide recommendations about specific contractors 
                or construction projects.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Third-Party Links and Content
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                Our website may contain links to third-party websites or reference third-party content. 
                We do not endorse or assume responsibility for the content, privacy policies, or practices 
                of any third-party websites or services.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Data Sources and Limitations
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                Our contractor data is primarily sourced from the California Contractors State License Board (CSLB) 
                and other public records. This data may have limitations including:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>Delays in updates from source databases</li>
                <li>Incomplete or missing information in original records</li>
                <li>Potential errors in data processing or display</li>
                <li>Limited historical information</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Changes to Disclaimer
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                We reserve the right to modify this disclaimer at any time. Changes will be posted on this page with 
                an updated revision date. Your continued use of the website after any changes constitutes acceptance 
                of the updated disclaimer.
              </p>

              <div style={{ 
                background: '#f8d7da', 
                border: '1px solid #f5c6cb', 
                borderRadius: '8px', 
                padding: '1.5rem', 
                marginTop: '2rem'
              }}>
                <h3 style={{ color: '#721c24', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  🚨 Final Reminder
                </h3>
                <p style={{ color: '#721c24', marginBottom: 0 }}>
                  <strong>Always verify contractor information independently before making hiring decisions.</strong> This 
                  website is a starting point for research, not a substitute for proper due diligence and verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}