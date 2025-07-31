import Head from 'next/head'
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - Contractor License Verification Service | Lookup Contractor</title>
        <meta name="description" content="Terms of Service for our free contractor license verification tool. User responsibilities, disclaimers, and guidelines for using our contractor credential checking service." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://lookupcontractor.com/terms-of-service" />
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

            <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>Terms of Service</h1>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem' }}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div style={{ lineHeight: '1.8', color: '#333' }}>
              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                1. Acceptance of Terms
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                By accessing and using Lookup Contractor ("the Service"), you accept and agree to be bound by these 
                Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                2. Description of Service
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                Lookup Contractor provides access to publicly available contractor licensing information from state 
                licensing boards. Our Service allows users to search for and verify contractor license information, 
                but we are not affiliated with any government agency or licensing board.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                3. User Responsibilities
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                You agree to:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>Use the Service only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Not use automated tools to scrape or harvest data from our Service</li>
                <li>Not interfere with the proper functioning of the Service</li>
                <li>Verify all contractor information independently before making hiring decisions</li>
                <li>Not rely solely on our Service for contractor vetting</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                4. Disclaimers and Limitations
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                <strong>NO WARRANTY:</strong> The Service is provided "as is" without warranties of any kind, 
                either express or implied, including but not limited to warranties of merchantability, 
                fitness for a particular purpose, or non-infringement.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>DATA ACCURACY:</strong> While we strive to provide accurate and up-to-date information, 
                we cannot guarantee the accuracy, completeness, or timeliness of the contractor data displayed. 
                Information may be outdated, incomplete, or contain errors.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>NOT A RECOMMENDATION:</strong> The inclusion of a contractor in our database does not 
                constitute a recommendation, endorsement, or guarantee of their work quality, reliability, or trustworthiness.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                5. Limitation of Liability
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                IN NO EVENT SHALL LOOKUP CONTRACTOR BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, 
                DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                Our total liability to you for all claims arising from or relating to the Service shall not 
                exceed $100 or the amount you paid us in the past 12 months, whichever is less.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                6. Indemnification
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                You agree to indemnify and hold harmless Lookup Contractor from any claims, damages, losses, 
                liabilities, and expenses (including reasonable attorneys' fees) arising from your use of the 
                Service or violation of these Terms.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                7. Prohibited Uses
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                You may not use our Service:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                8. Termination
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                We may terminate or suspend your access to our Service immediately, without prior notice or 
                liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                9. Changes to Terms
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                10. Governing Law
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                These Terms shall be interpreted and governed by the laws of the State of California, 
                without regard to its conflict of law provisions.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                11. Contact Information
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                If you have any questions about these Terms of Service, please contact us at{' '}
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