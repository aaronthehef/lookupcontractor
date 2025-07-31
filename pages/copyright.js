import Head from 'next/head'
import Link from 'next/link'

export default function Copyright() {
  return (
    <>
      <Head>
        <title>Copyright & Intellectual Property - Usage Rights | Lookup Contractor</title>
        <meta name="description" content="Copyright and intellectual property information for our contractor license verification service, including usage rights and restrictions for our database and tools." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://lookupcontractor.com/copyright" />
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
              Copyright & Intellectual Property
            </h1>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem' }}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div style={{ lineHeight: '1.8', color: '#333' }}>
              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Website Copyright
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                © {new Date().getFullYear()} Lookup Contractor. All rights reserved.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                The design, layout, graphics, photographs, images, text, and other content on this website 
                (collectively, the "Content") are protected by copyright, trademark, and other intellectual 
                property laws. The Content is the property of Lookup Contractor or its content suppliers 
                and is protected by applicable copyright laws.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Permitted Use
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                You are granted a limited, non-exclusive, non-transferable license to:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>Access and use the website for personal, non-commercial purposes</li>
                <li>View and print individual pages for personal reference</li>
                <li>Share links to specific pages on the website</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Prohibited Use
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                You may NOT:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the website</li>
                <li>Use automated systems (bots, scrapers, crawlers) to access or collect data</li>
                <li>Create derivative works based on the website content</li>
                <li>Remove or alter any copyright, trademark, or other proprietary notices</li>
                <li>Use the website content for commercial purposes without written permission</li>
                <li>Frame or embed website content on other websites</li>
                <li>Reverse engineer any part of the website or its underlying technology</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Public Data Disclaimer
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                The contractor licensing information displayed on this website is derived from publicly 
                available government records. While we have compiled and organized this data, the underlying 
                factual information (license numbers, business names, addresses, etc.) is public domain 
                information sourced from state licensing boards.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                However, our presentation, organization, compilation, and unique formatting of this data, 
                along with our search algorithms and user interface design, constitute original works 
                protected by copyright.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Trademarks
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                "Lookup Contractor" and the Lookup Contractor logo are trademarks of Lookup Contractor. 
                All other trademarks, service marks, and trade names referenced on this website are the 
                property of their respective owners.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Digital Millennium Copyright Act (DMCA)
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                We respect the intellectual property rights of others and expect our users to do the same. 
                If you believe that your copyrighted work has been copied and is accessible on this website 
                in a way that constitutes copyright infringement, please contact us with the following information:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>A description of the copyrighted work that you claim has been infringed</li>
                <li>A description of where the allegedly infringing material is located on our website</li>
                <li>Your contact information (address, phone number, email address)</li>
                <li>A statement that you have a good faith belief that the use is not authorized</li>
                <li>A statement that the information in your notice is accurate</li>
                <li>Your physical or electronic signature</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Fair Use and Research
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                Limited use of our website content may be permitted under fair use doctrine for purposes such as:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>Educational or research purposes</li>
                <li>News reporting or commentary</li>
                <li>Criticism or review</li>
              </ul>
              <p style={{ marginBottom: '1rem' }}>
                However, any such use must be transformative, limited in scope, and should not harm the 
                market for or value of our website. When in doubt, please contact us for permission.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                API and Data Access
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                We do not currently offer a public API or bulk data access. Any automated access to our 
                website or data is prohibited without explicit written permission. For businesses or 
                researchers interested in accessing our data, please contact us to discuss licensing options.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                User-Generated Content
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                While our website does not currently accept user submissions, any content you may submit 
                in the future (such as reviews, comments, or feedback) would become the property of 
                Lookup Contractor, and you would grant us a perpetual, irrevocable, worldwide, 
                royalty-free license to use, modify, and distribute such content.
              </p>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Enforcement
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                We actively monitor for unauthorized use of our website and content. Violations of these 
                intellectual property rights may result in:
              </p>
              <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
                <li>Immediate termination of access to our website</li>
                <li>Legal action to seek damages and injunctive relief</li>
                <li>Reporting to relevant authorities or service providers</li>
              </ul>

              <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Contact Information
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                For questions about copyright, intellectual property, or to request permission for use 
                beyond what is permitted above, please contact us at{' '}
                <Link href="/contact" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                  our contact page
                </Link>.
              </p>

              <div style={{ 
                background: '#e7f3ff', 
                border: '1px solid #bee5eb', 
                borderRadius: '8px', 
                padding: '1.5rem', 
                marginTop: '2rem'
              }}>
                <h3 style={{ color: '#0c5460', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  💡 Need Permission?
                </h3>
                <p style={{ color: '#0c5460', marginBottom: 0 }}>
                  If you're unsure whether your intended use requires permission, err on the side of caution 
                  and contact us. We're generally happy to work with legitimate users who respect our intellectual property rights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}