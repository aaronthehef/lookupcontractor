import Head from 'next/head'
import Link from 'next/link'

export default function FreeSiteLanding() {
  return (
    <>
      <Head>
        <title>Free Contractor Website Example - Get More Leads</title>
        <meta name="description" content="We'll build you a free example website for your contracting business. Quick, free, and designed to help you win more jobs." />
        <meta name="keywords" content="free contractor website, contractor lead generation, construction website, contractor marketing" />
        <meta property="og:title" content="Free Contractor Website Example - Get More Leads" />
        <meta property="og:description" content="We'll build you a free example website for your contracting business. Quick, free, and designed to help you win more jobs." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://lookupcontractor.com/free-site" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
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
            <Link href="/contractor/login" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>
              Login
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '4rem 2rem', 
          textAlign: 'center', 
          color: 'white' 
        }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem', 
            lineHeight: '1.2',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            We'll build you a free example website for your contracting business
          </h1>
          
          <p style={{ 
            fontSize: '1.4rem', 
            marginBottom: '3rem', 
            opacity: 0.95,
            lineHeight: '1.6',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            It's quick, free, and designed to help you win more jobs
          </p>

          <Link 
            href="/free-site/start"
            style={{
              display: 'inline-block',
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '1.25rem 3rem',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#d97706'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 12px 35px rgba(217, 119, 6, 0.4)'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#f59e0b'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.3)'
            }}
          >
            Get Started →
          </Link>
        </div>

        {/* Benefits Section */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          backdropFilter: 'blur(10px)',
          padding: '3rem 2rem'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ 
              textAlign: 'center', 
              fontSize: '2.5rem', 
              color: 'white', 
              marginBottom: '3rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Why contractors choose our free websites
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '2rem', 
                borderRadius: '12px',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
                <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '1rem' }}>Mobile Optimized</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                  70% of customers search on mobile. Your site will look perfect on every device.
                </p>
              </div>

              <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '2rem', 
                borderRadius: '12px',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '1rem' }}>Fast Setup</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                  LogicPros handles everything. Just fill out one form and we'll have your demo ready in 24 hours.
                </p>
              </div>

              <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '2rem', 
                borderRadius: '12px',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '1rem' }}>Lead Generation Focus</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                  Designed specifically to convert visitors into paying customers for contractors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '2rem', 
              marginBottom: '2rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Join 10,000+ contractors already on LookupContractor
            </h3>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255,255,255,0.2)',
              marginBottom: '3rem'
            }}>
              <p style={{ 
                color: 'white', 
                fontSize: '1.1rem', 
                fontStyle: 'italic', 
                marginBottom: '1rem',
                lineHeight: '1.6'
              }}>
                "After getting my free website example, I saw a 40% increase in leads within the first month. The design is clean and professional - exactly what my roofing business needed."
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                — Mike Rodriguez, C-39 Roofing Contractor, Los Angeles
              </p>
            </div>

            <Link 
              href="/free-site/start"
              style={{
                display: 'inline-block',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '1rem 2.5rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                borderRadius: '8px',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#059669'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#10b981'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              Start My Free Website →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
          background: 'rgba(0,0,0,0.2)', 
          color: 'rgba(255,255,255,0.8)', 
          textAlign: 'center', 
          padding: '2rem' 
        }}>
          <p style={{ margin: 0 }}>
            © 2025 LookupContractor.com - Free contractor websites by LogicPros that generate leads
          </p>
        </footer>
      </div>
    </>
  )
}