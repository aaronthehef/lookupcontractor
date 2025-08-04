import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

export default function CaliforniaContractorLicenseLookup() {
  const [searchTerm, setSearchTerm] = useState('')

  // Parse search terms to determine type and location
  const parseSmartSearch = (input) => {
    const text = input.toLowerCase().trim()
    
    // License number detection (digits only)
    if (/^\d+$/.test(text)) {
      return { type: 'license', term: text.toUpperCase(), state: 'california', city: null }
    }
    
    // Contractor types mapping
    const contractorTypes = {
      'plumber': 'c-36', 'plumbers': 'c-36', 'plumbing': 'c-36',
      'electrician': 'c-10', 'electricians': 'c-10', 'electrical': 'c-10', 'electric': 'c-10',
      'roofer': 'c-39', 'roofers': 'c-39', 'roofing': 'c-39',
      'hvac': 'c-20', 'heating': 'c-20', 'painter': 'c-33', 'painters': 'c-33', 'painting': 'c-33',
      'landscaper': 'c-27', 'landscapers': 'c-27', 'landscaping': 'c-27',
      'builder': 'b', 'builders': 'b', 'construction': 'b'
    }
    
    // State names (should not be treated as cities)
    const stateNames = ['california', 'ca', 'texas', 'tx', 'florida', 'fl', 'new york', 'ny']
    
    // City abbreviations
    const cityAbbreviations = {
      'la': 'LOS ANGELES', 'sf': 'SAN FRANCISCO', 'sd': 'SAN DIEGO'
    }
    
    // Simple pattern: "contractors in city" or "city contractors"
    let detectedType = null
    let detectedCity = null
    let isStatewide = false
    
    // Find contractor type
    for (const [keyword, code] of Object.entries(contractorTypes)) {
      if (text.includes(keyword)) {
        detectedType = code
        break
      }
    }
    
    // Find location using multiple patterns
    let locationMatch = text.match(/(?:in|near)\s+([a-z\s]+)/) || text.match(/([a-z\s]+)\s+(?:area|contractors?)/)
    
    // If no location found with prepositions, try simple "trade city" pattern
    if (!locationMatch && detectedType) {
      // Look for city names at the end after removing the trade keyword
      const tradeKeyword = Object.keys(contractorTypes).find(keyword => text.includes(keyword))
      if (tradeKeyword) {
        const withoutTrade = text.replace(tradeKeyword, '').trim()
        if (withoutTrade) {
          // Simple city names (should be enhanced with known city list)
          const knownCities = [
            'los angeles', 'san francisco', 'san diego', 'sacramento', 'fresno', 'long beach',
            'oakland', 'bakersfield', 'stockton', 'fremont', 'san jose', 'irvine', 'chula vista',
            'riverside', 'santa ana', 'anaheim', 'modesto', 'huntington beach', 'glendale',
            'oxnard', 'fontana', 'moreno valley', 'santa clarita', 'oceanside', 'garden grove'
          ]
          
          for (const city of knownCities) {
            if (withoutTrade.includes(city)) {
              locationMatch = [null, city] // Match format: [fullMatch, cityGroup]
              break
            }
          }
        }
      }
    }
    
    if (locationMatch) {
      const location = locationMatch[1].trim()
      
      // Check if it's a state name
      if (stateNames.includes(location)) {
        isStatewide = true
        detectedCity = null // Don't filter by city for statewide searches
      } else {
        detectedCity = cityAbbreviations[location] || location.toUpperCase()
      }
    }
    
    // Business name fallback
    if (!detectedType) {
      return { type: 'business', term: input.trim(), state: 'california', city: detectedCity }
    }
    
    return {
      type: 'classification',
      term: detectedType,
      state: 'california',
      city: detectedCity
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const searchValue = e.target.searchInput.value.trim()
    if (searchValue) {
      // Simple redirect to homepage with search parameter
      window.location.href = `/?search=${encodeURIComponent(searchValue)}`
    }
  }

  return (
    <>
      <Head>
        <title>California Contractor License Lookup - Official CSLB Database Search</title>
        <meta name="description" content="Official California contractor license lookup tool. Search 240,000+ licensed contractors, verify credentials, check license status. Free CSLB database access." />
        <meta name="keywords" content="california contractor license lookup, contractor license verification california, ca contractor lookup, california contractor database, CSLB search" />
        <meta property="og:title" content="California Contractor License Lookup - Official CSLB Database Search" />
        <meta property="og:description" content="Official California contractor license lookup tool. Search 240,000+ licensed contractors, verify credentials, check license status. Free CSLB database access." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lookupcontractor.com/california-contractor-license-lookup" />
        <link rel="canonical" href="https://lookupcontractor.com/california-contractor-license-lookup" />
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
            California Contractor License Lookup
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
              🏗️ California Contractor License Lookup
            </h1>
            <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '2rem', fontWeight: 'normal' }}>
              Verify Any California Contractor's License Instantly
            </h2>
            
            <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem', lineHeight: 1.6 }}>
              The most comprehensive California contractor license lookup tool. Search <strong>240,000+ licensed contractors</strong> 
              using official CSLB data. Protect your project by verifying credentials before you hire.
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
                  name="searchInput"
                  placeholder="License number, business name, city, or contractor type..."
                  required
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
                  🔍 Lookup License
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.9rem', color: '#666' }}>
              <span>✅ Official CSLB Data</span>
              <span>✅ Real-Time Updates</span>
              <span>✅ 100% Free</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {[
              { number: '240,000+', label: 'Licensed Contractors', icon: '👷' },
              { number: '58 Counties', label: 'Statewide Coverage', icon: '🏛️' },
              { number: '50+ Types', label: 'Contractor Classifications', icon: '🔧' },
              { number: '100%', label: 'CSLB Verified Data', icon: '✅' }
            ].map((stat, index) => (
              <div key={index} style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>{stat.number}</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Popular Cities */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem',
            marginBottom: '3rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
              🏙️ Popular California Cities
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                'Los Angeles', 'San Diego', 'San Francisco', 'Sacramento', 'San Jose', 'Fresno',
                'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside'
              ].map((city) => (
                <Link key={city} href={`/contractors/california/${city.toLowerCase().replace(/\s+/g, '-')}`}>
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
                    <div style={{ fontWeight: 'bold' }}>{city} Contractors</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>License Lookup</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem',
            marginBottom: '3rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>
              📋 How California Contractor License Lookup Works
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {[
                {
                  step: '1',
                  title: 'Enter Search Terms',
                  description: 'Input license number, business name, location, or contractor type'
                },
                {
                  step: '2', 
                  title: 'Search CSLB Database',
                  description: 'Our tool searches the official California State License Board database'
                },
                {
                  step: '3',
                  title: 'View Results',
                  description: 'Get complete contractor profiles with license status, contact info, and credentials'
                },
                {
                  step: '4',
                  title: 'Make Informed Decisions',
                  description: 'Hire with confidence knowing you\'ve verified their legitimate licensing'
                }
              ].map((item) => (
                <div key={item.step} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: '#3b82f6', 
                    color: 'white', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    margin: '0 auto 1rem auto'
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>{item.title}</h3>
                  <p style={{ color: '#666', lineHeight: 1.5 }}>{item.description}</p>
                </div>
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
              Start Your California Contractor License Lookup
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
              Don't risk hiring an unlicensed contractor. Verify their credentials now!
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
              🚀 Begin License Search
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
            California Contractor License Lookup - Official CSLB Database Search
          </p>
        </footer>
      </div>
    </>
  )
}