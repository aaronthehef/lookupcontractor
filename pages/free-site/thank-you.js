import Head from 'next/head'
import Link from 'next/link'

export default function FreeSiteThankYou() {
  return (
    <>
      <Head>
        <title>Thank You! Your Free Website Is Being Created</title>
        <meta name="description" content="Thanks for signing up! We'll contact you shortly with your free contractor website demo." />
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
        {/* Header */}
        <header style={{ 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
              LookupContractor
            </Link>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>
              Home
            </Link>
          </div>
        </header>

        {/* Success Section */}
        <div style={{ 
          maxWidth: '700px', 
          margin: '0 auto', 
          padding: '4rem 2rem', 
          textAlign: 'center' 
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1rem', 
              color: '#333',
              fontWeight: 'bold'
            }}>
              Thank You!
            </h1>
            
            <p style={{ 
              color: '#666', 
              fontSize: '1.2rem',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              Our development partner LogicPros is starting work on your free contractor website demo right now. 
              You'll hear from us within 24 hours with a preview of your new site.
            </p>

            <div style={{
              background: '#f0fdf4',
              border: '2px solid #10b981',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ 
                color: '#065f46', 
                fontSize: '1.3rem', 
                marginBottom: '1rem',
                fontWeight: 'bold'
              }}>
                What happens next?
              </h3>
              <div style={{ textAlign: 'left', color: '#047857' }}>
                <div style={{ marginBottom: '0.5rem' }}>✅ LogicPros will analyze your business and create a custom design</div>
                <div style={{ marginBottom: '0.5rem' }}>✅ You'll receive an email with your website preview</div>
                <div style={{ marginBottom: '0.5rem' }}>✅ We'll schedule a quick call to walk through it together</div>
                <div>✅ If you love it, LogicPros can make it live immediately</div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <p style={{ 
                color: '#92400e', 
                fontSize: '1.1rem', 
                margin: 0,
                fontWeight: '500'
              }}>
                Want to speed things up? Answer a few quick questions about your business to help us create the perfect website for you.
              </p>
            </div>

            <Link 
              href="/free-site/discovery"
              style={{
                display: 'inline-block',
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.2s',
                marginBottom: '2rem'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#d97706'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f59e0b'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              Answer Quick Questions →
            </Link>

            <div style={{ 
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1.5rem',
              color: '#666',
              fontSize: '0.95rem'
            }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                <strong>Questions?</strong> Email us at info@lookupcontractor.com or call (555) 123-4567
              </p>
              <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                ← Return to LookupContractor.com
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}