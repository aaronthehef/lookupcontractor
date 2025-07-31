import Head from 'next/head'
import Link from 'next/link'

export default function DataSources() {
  return (
    <>
      <Head>
        <title>Data Sources & Attribution - Official Contractor License Database | Lookup Contractor</title>
        <meta name="description" content="Learn about our official data sources for contractor license verification. We use California Contractors State License Board (CSLB) and other government databases to verify contractor credentials." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://lookupcontractor.com/data-sources" />
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

            <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>
              Data Sources & Attribution
            </h1>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem' }}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div style={{ 
              background: '#e3f2fd', 
              border: '1px solid #bbdefb', 
              borderRadius: '8px', 
              padding: '1.5rem', 
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: '#0d47a1', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                📊 Data Transparency
              </h3>
              <p style={{ color: '#0d47a1', marginBottom: 0 }}>
                We believe in transparency about our data sources. All contractor information displayed 
                on this website is derived from publicly available government records.
              </p>
            </div>

            <div style={{ lineHeight: '1.8', color: '#333' }}>
              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Primary Data Source
              </h2>
              <div style={{ 
                background: '#f5f5f5', 
                borderLeft: '4px solid #3b82f6', 
                padding: '1.5rem', 
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ color: '#333', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  California Contractors State License Board (CSLB)
                </h3>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>Official Website:</strong>{' '}
                  <a href="https://www.cslb.ca.gov/" target="_blank" rel="noopener noreferrer" 
                     style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    www.cslb.ca.gov
                  </a>
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>License Lookup Tool:</strong>{' '}
                  <a href="https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx" 
                     target="_blank" rel="noopener noreferrer" 
                     style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    CSLB License Check
                  </a>
                </p>
                <p style={{ marginBottom: 0 }}>
                  The CSLB is the official state agency responsible for licensing and regulating construction 
                  contractors in California. All contractor licensing information displayed on our website 
                  originates from CSLB's public records database.
                </p>
              </div>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Data Elements Included
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                Our database includes the following publicly available information from CSLB records:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li><strong>License Numbers:</strong> Official CSLB license numbers</li>
                <li><strong>Business Names:</strong> Registered business names and DBA names</li>
                <li><strong>License Classifications:</strong> Contractor specialties and trade classifications</li>
                <li><strong>License Status:</strong> Current status (Active, Inactive, Suspended, etc.)</li>
                <li><strong>Business Addresses:</strong> Mailing and business addresses on file</li>
                <li><strong>Phone Numbers:</strong> Contact phone numbers when available</li>
                <li><strong>License Issue/Expiration Dates:</strong> When available in public records</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Data Processing and Updates
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Data Collection:</strong> We periodically collect publicly available contractor 
                data from CSLB's database through automated processes that respect their terms of service.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Processing:</strong> Raw data is processed, cleaned, and organized to improve 
                searchability and user experience while maintaining accuracy of the original information.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Update Frequency:</strong> We strive to update our database regularly, but there 
                may be delays between when information changes in CSLB records and when it appears on our site.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Data Accuracy and Limitations
              </h2>
              <div style={{ 
                background: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '8px', 
                padding: '1.5rem', 
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ color: '#856404', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  ⚠️ Important Limitations
                </h3>
                <ul style={{ color: '#856404', paddingLeft: '1.5rem', marginBottom: 0 }}>
                  <li>Data may not reflect the most current information</li>
                  <li>Some records may contain incomplete or outdated information</li>
                  <li>Historical data availability varies by contractor and time period</li>
                  <li>Data processing may introduce minor formatting changes</li>
                </ul>
              </div>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Independent Verification
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Always Verify Directly:</strong> While we strive for accuracy, users should 
                always verify contractor information directly with the CSLB before making hiring decisions.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Official Verification:</strong> Use the official CSLB license lookup tool at{' '}
                <a href="https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx" 
                   target="_blank" rel="noopener noreferrer" 
                   style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                  CSLB License Check
                </a>{' '}
                for the most current and authoritative information.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Additional Resources
              </h2>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>
                  <strong>File a Complaint:</strong>{' '}
                  <a href="https://www.cslb.ca.gov/Consumers/Filing_A_Complaint/" 
                     target="_blank" rel="noopener noreferrer" 
                     style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    CSLB Complaint Process
                  </a>
                </li>
                <li>
                  <strong>Contractor Requirements:</strong>{' '}
                  <a href="https://www.cslb.ca.gov/About_CSLB/Library/Licensing_Requirements/" 
                     target="_blank" rel="noopener noreferrer" 
                     style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    CSLB Licensing Requirements
                  </a>
                </li>
                <li>
                  <strong>Consumer Tips:</strong>{' '}
                  <a href="https://www.cslb.ca.gov/Consumers/" 
                     target="_blank" rel="noopener noreferrer" 
                     style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    CSLB Consumer Resources
                  </a>
                </li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Data Usage and Attribution
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                This website provides access to public information for informational purposes only. 
                While the underlying government data is in the public domain, our compilation, 
                organization, and presentation of this data is protected by copyright.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Commercial Use:</strong> Commercial use of our compiled data requires explicit 
                written permission. Contact us for licensing inquiries.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Data Corrections
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                If you notice incorrect information about a contractor's license, please note that 
                we display information as it appears in CSLB records. To correct official licensing 
                information, contact the CSLB directly.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                For issues specific to our website's display or processing of data, please{' '}
                <Link href="/contact" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                  contact us
                </Link>.
              </p>

              <div style={{ 
                background: '#e8f5e8', 
                border: '1px solid #c3e6c3', 
                borderRadius: '8px', 
                padding: '1.5rem', 
                marginTop: '2rem'
              }}>
                <h3 style={{ color: '#2e7d2e', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  📋 Supporting CSLB's Mission
                </h3>
                <p style={{ color: '#2e7d2e', marginBottom: 0 }}>
                  We are not affiliated with or endorsed by the CSLB. However, we support their mission 
                  to protect consumers and promote quality construction. By making publicly available 
                  licensing information more accessible, we help consumers make informed decisions while 
                  encouraging proper licensing and regulatory compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}