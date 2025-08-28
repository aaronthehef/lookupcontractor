import Head from 'next/head'
import Link from 'next/link'

export default function DiscoveryComplete() {
  return (
    <>
      <Head>
        <title>Discovery Complete! Your Custom Website is Coming Soon</title>
        <meta name="description" content="Thanks for completing our discovery questions! Your custom contractor website will be even better now." />
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', paddingTop: '80px' }}>

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
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
            
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1rem', 
              color: '#333',
              fontWeight: 'bold'
            }}>
              Perfect! Discovery Complete
            </h1>
            
            <p style={{ 
              color: '#666', 
              fontSize: '1.2rem',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              Your answers will help our development partner LogicPros create the perfect website for your contracting business. 
              We now have everything we need to build something amazing!
            </p>

            <div style={{
              background: '#f0fdf4',
              border: '2px solid #10b981',
              borderRadius: '12px',
              padding: '2rem',
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
              <div style={{ textAlign: 'left', color: '#047857', fontSize: '1.1rem' }}>
                <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>✅</span>
                  <span>LogicPros will use your answers to create a fully customized website mockup</span>
                </div>
                <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>✅</span>
                  <span>Your website will include your specific services, style preferences, and industry focus</span>
                </div>
                <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>✅</span>
                  <span>You'll receive a detailed preview within 24-48 hours</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>✅</span>
                  <span>We'll schedule a call to review everything together with LogicPros</span>
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#ecfdf5',
              border: '2px solid #d1fae5',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚀</div>
              <h4 style={{ 
                color: '#065f46', 
                fontSize: '1.2rem', 
                margin: '0 0 0.5rem 0',
                fontWeight: 'bold'
              }}>
                Faster Turnaround
              </h4>
              <p style={{ 
                color: '#047857', 
                fontSize: '1rem', 
                margin: 0,
                fontWeight: '500'
              }}>
                Because you completed our discovery questions, your website will be ready faster and more accurately reflect your business needs!
              </p>
            </div>

            <div style={{ 
              borderTop: '1px solid #e5e7eb',
              paddingTop: '2rem',
              color: '#666',
              fontSize: '0.95rem'
            }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                <strong>Questions in the meantime?</strong><br/>
                Email us at contact@lookupcontractor.com or call (555) 123-4567
              </p>
              <Link href="/" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '500' }}>
                ← Return to LookupContractor.com
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}