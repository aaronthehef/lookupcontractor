import Link from 'next/link'
import Head from 'next/head'

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Server Error - Lookup Contractor</title>
        <meta name="description" content="We're experiencing technical difficulties. Please try again later." />
        <meta name="robots" content="noindex" />
      </Head>
      
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
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
          {/* 500 Animation */}
          <div style={{
            fontSize: '6rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            500
          </div>
          
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          
          <h1 style={{
            fontSize: '2rem',
            color: '#1f2937',
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            Server Error
          </h1>
          
          <p style={{
            color: '#6b7280',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            We're experiencing technical difficulties on our end. 
            Our team has been notified and is working to fix the issue.
          </p>

          {/* Status info */}
          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid #fecaca'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              color: '#dc2626',
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              What you can do:
            </h3>
            <ul style={{
              textAlign: 'left',
              color: '#6b7280',
              lineHeight: 1.6,
              paddingLeft: '1.5rem'
            }}>
              <li>Wait a few minutes and try again</li>
              <li>Check if the issue persists by refreshing the page</li>
              <li>Try accessing a different page on our site</li>
              <li>Clear your browser cache and cookies</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#dc2626',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.5)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#b91c1c'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#dc2626'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              🔄 Try Again
            </button>
            
            <Link 
              href="/"
              style={{
                background: 'white',
                color: '#dc2626',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                border: '2px solid #dc2626',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fef2f2'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              🏠 Go Home
            </Link>
          </div>

          {/* Status message */}
          <div style={{
            padding: '1rem',
            background: '#f0f9ff',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#1e40af',
            border: '1px solid #bfdbfe'
          }}>
            <strong>Status:</strong> We monitor our services 24/7. If this error persists, 
            it will be automatically reported to our technical team.
          </div>
        </div>
      </div>
    </>
  )
}