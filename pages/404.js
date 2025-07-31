import Link from 'next/link'
import Head from 'next/head'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - Lookup Contractor</title>
        <meta name="description" content="The page you're looking for could not be found. Search our database of licensed contractors." />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://lookupcontractor.com/404" />
      </Head>
      
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
          background: 'white',
          padding: '3rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          {/* 404 Animation */}
          <div style={{
            fontSize: '6rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            animation: 'pulse 2s infinite'
          }}>
            404
          </div>
          
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          
          <h1 style={{
            fontSize: '2rem',
            color: '#1f2937',
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            Page Not Found
          </h1>
          
          <p style={{
            color: '#6b7280',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            The page you're looking for doesn't exist or may have been moved. 
            Don't worry - you can still search our database of 240,000+ licensed contractors.
          </p>

          {/* Search suggestions */}
          <div style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              color: '#374151',
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              Popular Searches:
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center'
            }}>
              {[
                'Electricians in Los Angeles',
                'Plumbers in San Francisco', 
                'General Contractors',
                'Roofing Contractors',
                'HVAC Contractors'
              ].map((search, index) => (
                <Link 
                  key={index}
                  href={`/?search=${encodeURIComponent(search)}`}
                  style={{
                    background: 'white',
                    color: '#3b82f6',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#3b82f6'
                    e.target.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white'
                    e.target.style.color = '#3b82f6'
                  }}
                >
                  {search}
                </Link>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              href="/"
              style={{
                background: '#3b82f6',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              🏠 Go Home
            </Link>
            
            <Link 
              href="/contractors/california"
              style={{
                background: 'white',
                color: '#3b82f6',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                border: '2px solid #3b82f6',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f9ff'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              📋 Browse Contractors
            </Link>
          </div>

          {/* Contact info */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#fef3c7',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#92400e'
          }}>
            <strong>Need help?</strong> If you believe this is an error, please check the URL or 
            <Link href="/" style={{ color: '#b45309', textDecoration: 'underline' }}> contact us</Link>.
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  )
}