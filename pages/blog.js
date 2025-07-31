import Head from 'next/head'
import Link from 'next/link'

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "5 Red Flags When Hiring a California Contractor - Protect Yourself from Scams",
      excerpt: "Learn the warning signs of unlicensed California contractors and how to protect yourself from common construction scams. Always verify CSLB licenses before hiring.",
      date: "2025-08-07",
      slug: "red-flags-hiring-contractor",
      category: "Safety Tips"
    },
    {
      id: 2,
      title: "How to Read a California Contractor License Status",
      excerpt: "Understanding what 'CLEAR', 'SUSPENDED', and 'EXPIRED' mean on contractor licenses. Know what to look for when verifying credentials.",
      date: "2025-08-14",
      slug: "understanding-license-status",
      category: "License Guide"
    },
    {
      id: 3,
      title: "California Contractor License Classifications Explained (A, B, C)",
      excerpt: "Complete guide to California contractor license classes. Learn the difference between Class A, B, and specialty C licenses.",
      date: "2025-08-21",
      slug: "contractor-license-classifications",
      category: "License Guide"
    },
    {
      id: 4,
      title: "Why You Should Never Hire an Unlicensed Contractor",
      excerpt: "The legal and financial risks of hiring unlicensed contractors. Protect your investment and ensure quality work with proper verification.",
      date: "2025-08-28",
      slug: "never-hire-unlicensed-contractor",
      category: "Safety Tips"
    },
    {
      id: 5,
      title: "How to Check if a Contractor's Insurance and Bond are Current",
      excerpt: "Step-by-step guide to verifying contractor insurance and bond status. Essential protection for homeowners and businesses.",
      date: "2025-09-04",
      slug: "verify-contractor-insurance-bond",
      category: "Verification Guide"
    },
    {
      id: 6,
      title: "Common Contractor Scams and How to Avoid Them",
      excerpt: "Protect yourself from door-to-door scams, advance payment schemes, and other common contractor fraud tactics.",
      date: "2025-09-11",
      slug: "common-contractor-scams",
      category: "Safety Tips"
    }
  ]

  return (
    <>
      <Head>
        <title>California Contractor Safety & CSLB Verification Guide | Lookup Contractor</title>
        <meta name="description" content="Expert tips on California contractor verification, CSLB license checking, and avoiding construction scams. Learn how to protect yourself when hiring CA contractors." />
        <meta name="keywords" content="contractor safety tips, license verification guide, construction scams, hiring contractors, CSLB license check" />
        <meta property="og:title" content="Contractor Safety & Verification Blog | Lookup Contractor" />
        <meta property="og:description" content="Expert tips on contractor verification, license checking, and avoiding construction scams." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lookupcontractor.com/blog" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://lookupcontractor.com/blog" />
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
          <p style={{ fontSize: '1.3rem', opacity: 0.9, margin: 0, marginTop: '0.5rem' }}>
            California Contractor Safety & CSLB Guide
          </p>
        </header>

        {/* Content */}
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem 4rem 2rem' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '3rem', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '1rem' }}>
                ← Back to Home
              </Link>
            </div>

            <h2 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>
              📖 California Contractor Safety & CSLB Verification Guide
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: 1.6 }}>
              Expert tips and guides to help you safely hire California contractors, verify CSLB licenses, and protect yourself from scams. <strong>Texas guides coming soon!</strong>
            </p>

            {/* Blog Posts Grid */}
            <div style={{ display: 'grid', gap: '2rem' }}>
              {blogPosts.map(post => (
                <article key={post.id} style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px', 
                  padding: '2rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ 
                      background: '#3b82f6', 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {post.category}
                    </span>
                    <time style={{ color: '#666', fontSize: '0.9rem' }}>
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: '#333', 
                    marginBottom: '1rem',
                    lineHeight: 1.4
                  }}>
                    {post.title}
                  </h3>
                  
                  <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {post.excerpt}
                  </p>
                  
                  <div style={{ 
                    color: '#3b82f6', 
                    fontWeight: '500',
                    fontSize: '0.95rem'
                  }}>
                    Coming Soon - Stay Tuned! →
                  </div>
                </article>
              ))}
            </div>

            {/* Call to Action */}
            <div style={{ 
              background: '#f0f8ff', 
              border: '1px solid #b3d9ff', 
              borderRadius: '12px', 
              padding: '2rem', 
              textAlign: 'center',
              marginTop: '3rem'
            }}>
              <h3 style={{ color: '#0066cc', fontSize: '1.3rem', marginBottom: '1rem' }}>
                🔍 Need to Verify a Contractor Right Now?
              </h3>
              <p style={{ color: '#0066cc', marginBottom: '1.5rem' }}>
                Don't wait - use our free contractor license verification tool to check credentials instantly.
              </p>
              <Link href="/" style={{ 
                background: '#3b82f6', 
                color: 'white', 
                padding: '1rem 2rem', 
                borderRadius: '8px', 
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                Verify Contractor License →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}