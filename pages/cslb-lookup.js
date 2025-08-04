import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function CSLBLookup() {
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    const searchTerm = e.target.search.value.trim()
    if (searchTerm) {
      router.push(`/?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <>
      <Head>
        <title>CSLB Lookup - Official California Contractor License Search</title>
        <meta name="description" content="Official CSLB license lookup tool. Search California State License Board contractor database. Verify contractor licenses, check status, and view credentials instantly." />
        <meta name="keywords" content="CSLB lookup, CSLB license search, California State License Board, contractor license lookup, CSLB database search" />
        <meta property="og:title" content="CSLB Lookup - Official California Contractor License Search" />
        <meta property="og:description" content="Official CSLB license lookup tool. Search California State License Board contractor database. Verify contractor licenses, check status, and view credentials instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lookupcontractor.com/cslb-lookup" />
        <link rel="canonical" href="https://lookupcontractor.com/cslb-lookup" />
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
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: '0.5rem 0 0 0' }}>
            Official CSLB License Lookup
          </p>
        </header>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          
          {/* Hero Section */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '3rem 2rem', 
            marginBottom: '3rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>
              🏛️ CSLB License Lookup
            </h1>
            <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '2rem', fontWeight: 'normal' }}>
              Official California State License Board Contractor Search
            </h2>
            
            <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem', lineHeight: 1.6 }}>
              Search the official CSLB database of <strong>240,000+ licensed contractors</strong> in California. 
              Verify licenses, check status, view credentials, and ensure legitimacy before hiring.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                maxWidth: '600px', 
                margin: '0 auto',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <input
                  type="text"
                  name="search"
                  placeholder="Enter license number, business name, or contractor type..."
                  style={{ 
                    flex: 1,
                    minWidth: '300px',
                    padding: '1rem', 
                    fontSize: '1.1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <button 
                  type="submit"
                  style={{ 
                    background: '#059669',
                    color: 'white', 
                    padding: '1rem 2rem', 
                    border: 'none', 
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    minWidth: '140px'
                  }}
                >
                  🔍 Search CSLB
                </button>
              </div>
            </form>

            <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
              Data sourced directly from the California State License Board (CSLB)
            </p>
          </div>

          {/* Features */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {[
              {
                icon: '🔍',
                title: 'Comprehensive Search',
                description: 'Search by license number, business name, contractor type, or location'
              },
              {
                icon: '✅',
                title: 'Real-Time Verification',
                description: 'Get current license status, expiration dates, and credential details'
              },
              {
                icon: '🏛️',
                title: 'Official CSLB Data',
                description: 'Direct access to California State License Board database'
              },
              {
                icon: '🆓',
                title: 'Completely Free',
                description: 'No registration required. Unlimited searches at no cost'
              }
            ].map((feature, index) => (
              <div key={index} style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>{feature.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.5 }}>{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Popular Searches */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem',
            marginBottom: '3rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
              🔥 Popular CSLB Searches
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {[
                { type: 'C-10', name: 'Electrical Contractors', icon: '⚡' },
                { type: 'C-36', name: 'Plumbing Contractors', icon: '🔧' },
                { type: 'B', name: 'General Building', icon: '🏗️' },
                { type: 'C-39', name: 'Roofing Contractors', icon: '🏠' },
                { type: 'C-27', name: 'Landscaping', icon: '🌿' },
                { type: 'C-20', name: 'HVAC Contractors', icon: '❄️' }
              ].map((contractor) => (
                <Link key={contractor.type} href={`/?search=${contractor.type}`}>
                  <div style={{ 
                    padding: '1rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    color: 'inherit',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6'
                    e.currentTarget.style.backgroundColor = '#f8fafc'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{contractor.icon}</div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{contractor.type}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>{contractor.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '3rem',
            textAlign: 'center',
            marginBottom: '3rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
              Ready to Verify a Contractor?
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
              Start your CSLB license lookup now and protect your project
            </p>
            <Link href="/" style={{
              background: '#3b82f6',
              color: 'white',
              padding: '1.25rem 2.5rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              🚀 Start CSLB Search
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
          background: 'rgba(255,255,255,0.1)', 
          color: 'white', 
          textAlign: 'center', 
          padding: '2rem',
          marginTop: '3rem'
        }}>
          <p style={{ margin: 0, opacity: 0.8 }}>
            CSLB License Lookup - Official California State License Board Search
          </p>
        </footer>
      </div>
    </>
  )
}