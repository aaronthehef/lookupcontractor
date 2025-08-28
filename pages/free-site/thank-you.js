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
              LogicPros will reach out shortly and begin working on the free example page. 
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
              backgroundColor: '#f0fdf4',
              border: '2px solid #10b981',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📞</div>
              <h3 style={{ 
                color: '#065f46', 
                fontSize: '1.3rem', 
                marginBottom: '1rem',
                fontWeight: 'bold'
              }}>
                Sit back and relax
              </h3>
              <p style={{ 
                color: '#047857', 
                fontSize: '1.1rem', 
                margin: 0,
                lineHeight: '1.6'
              }}>
                LogicPros will handle everything from here. They'll call you to discuss your specific needs and create a website example that's perfect for your business.
              </p>
            </div>

            <div style={{ 
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1.5rem',
              color: '#666',
              fontSize: '0.95rem'
            }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                <strong>Questions?</strong> Email us at contact@lookupcontractor.com
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