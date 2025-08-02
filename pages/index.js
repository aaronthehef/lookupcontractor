import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('license')
  const [selectedState, setSelectedState] = useState('')
  const [showAllStates, setShowAllStates] = useState(false)
  const [showAllContractorTypes, setShowAllContractorTypes] = useState(false)
  const [smartSearchTerm, setSmartSearchTerm] = useState('')

  const popularStates = [
    'California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania',
    'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia'
  ]

  const allStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 
    'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 
    'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 
    'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  const popularContractorTypes = [
    { code: 'B', name: 'General Building Contractor', count: '100,583', icon: '🏗️' },
    { code: 'C-10', name: 'Electrical Contractor', count: '20,234', icon: '⚡' },
    { code: 'A', name: 'General Engineering Contractor', count: '15,242', icon: '🌉' },
    { code: 'C-33', name: 'Painting Contractor', count: '12,792', icon: '🎨' },
    { code: 'C-36', name: 'Plumbing Contractor', count: '11,540', icon: '🔧' },
    { code: 'C-27', name: 'Landscaping Contractor', count: '10,102', icon: '🌿' },
    { code: 'C-20', name: 'HVAC Contractor', count: '8,865', icon: '❄️' },
    { code: 'C-39', name: 'Roofing Contractor', count: '3,817', icon: '🏠' }
  ]

  const allContractorTypes = [
    { code: 'A', name: 'General Engineering Contractor', icon: '🌉' },
    { code: 'B', name: 'General Building Contractor', icon: '🏗️' },
    { code: 'C-1', name: 'Acoustical Contractor', icon: '🔊' },
    { code: 'C-2', name: 'Insulation and Acoustical Contractor', icon: '🧱' },
    { code: 'C-3', name: 'Boiler, Hot-Water Heating and Steam Fitting Contractor', icon: '🔥' },
    { code: 'C-4', name: 'Boiler, Warm-Air Heating, Ventilating and Air-Conditioning Contractor', icon: '🌡️' },
    { code: 'C-5', name: 'Carpentry Contractor', icon: '🔨' },
    { code: 'C-6', name: 'Cabinet, Millwork and Finish Carpentry Contractor', icon: '🪵' },
    { code: 'C-7', name: 'Low Voltage Systems Contractor', icon: '📱' },
    { code: 'C-8', name: 'Concrete Contractor', icon: '🏗️' },
    { code: 'C-9', name: 'Drywall Contractor', icon: '🧱' },
    { code: 'C-10', name: 'Electrical Contractor', icon: '⚡' },
    { code: 'C-11', name: 'Elevator Contractor', icon: '🛗' },
    { code: 'C-12', name: 'Earthwork and Paving Contractor', icon: '🚜' },
    { code: 'C-13', name: 'Fencing Contractor', icon: '🚧' },
    { code: 'C-15', name: 'Flooring and Floor Covering Contractor', icon: '🏢' },
    { code: 'C-16', name: 'Fire Protection Contractor', icon: '🔥' },
    { code: 'C-17', name: 'Glazing Contractor', icon: '🪟' },
    { code: 'C-20', name: 'HVAC Contractor', icon: '❄️' },
    { code: 'C-21', name: 'Building Moving/Demolition Contractor', icon: '🏗️' },
    { code: 'C-22', name: 'Asbestos Abatement Contractor', icon: '☣️' },
    { code: 'C-23', name: 'Ornamental Metal Contractor', icon: '⚒️' },
    { code: 'C-27', name: 'Landscaping Contractor', icon: '🌿' },
    { code: 'C-28', name: 'Lock and Security Equipment Contractor', icon: '🔒' },
    { code: 'C-29', name: 'Masonry Contractor', icon: '🧱' },
    { code: 'C-31', name: 'Construction Zone Traffic Control Contractor', icon: '🚦' },
    { code: 'C-32', name: 'Parking and Highway Improvement Contractor', icon: '🛣️' },
    { code: 'C-33', name: 'Painting and Decorating Contractor', icon: '🎨' },
    { code: 'C-34', name: 'Pipeline Contractor', icon: '🔧' },
    { code: 'C-35', name: 'Lathing and Plastering Contractor', icon: '🏗️' },
    { code: 'C-36', name: 'Plumbing Contractor', icon: '🔧' },
    { code: 'C-38', name: 'Refrigeration Contractor', icon: '🧊' },
    { code: 'C-39', name: 'Roofing Contractor', icon: '🏠' },
    { code: 'C-42', name: 'Sanitation System Contractor', icon: '🚰' },
    { code: 'C-43', name: 'Sheet Metal Contractor', icon: '⚒️' },
    { code: 'C-45', name: 'Sign Contractor', icon: '🪧' },
    { code: 'C-46', name: 'Solar Contractor', icon: '☀️' },
    { code: 'C-47', name: 'General Manufactured Housing Contractor', icon: '🏠' },
    { code: 'C-50', name: 'Reinforcing Steel Contractor', icon: '⚒️' },
    { code: 'C-51', name: 'Structural Steel Contractor', icon: '🏗️' },
    { code: 'C-53', name: 'Swimming Pool Contractor', icon: '🏊' },
    { code: 'C-54', name: 'Ceramic and Mosaic Tile Contractor', icon: '🔲' },
    { code: 'C-55', name: 'Water Conditioning Contractor', icon: '💧' },
    { code: 'C-57', name: 'Well Drilling Contractor', icon: '🕳️' },
    { code: 'C-60', name: 'Welding Contractor', icon: '🔥' },
    { code: 'C-61', name: 'Limited Specialty Contractor', icon: '🔧' }
  ]

  const handleQuickSearch = () => {
    if (selectedState && searchTerm) {
      const stateCode = selectedState.toLowerCase().replace(' ', '-')
      window.location.href = `/search?state=${stateCode}&type=${searchType}&term=${encodeURIComponent(searchTerm)}`
    }
  }

  const parseSmartSearch = (input) => {
    const text = input.toLowerCase().trim()
    
    // License number check
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
    
    // Find location using simple pattern matching
    const locationMatch = text.match(/(?:in|near)\s+([a-z\s]+)/) || text.match(/([a-z\s]+)\s+(?:area|contractors?)/)
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

  const handleSmartSearch = async () => {
    if (!smartSearchTerm.trim()) return
    
    const parsed = parseSmartSearch(smartSearchTerm)
    
    // For license numbers and business names, allow search without location
    if (parsed.state || parsed.type === 'license' || parsed.type === 'business') {
      try {
        const requestBody = {
          searchTerm: smartSearchTerm, // Use original search term for smart parsing
          searchType: 'smart', // Use smart search type to enable proper parsing
          city: parsed.city,
          state: parsed.state || 'california', // Default to CA if no state specified
          limit: 50 // Show 50 results per page
        }
        
        // Debug what we're sending
        console.log('Sending to API:', requestBody)
        
        // Call the search API directly with proper parameters
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })
        
        const data = await response.json()
        
        if (response.ok) {
          // Store results and redirect to results page
          localStorage.setItem('searchResults', JSON.stringify(data))
          localStorage.setItem('searchQuery', smartSearchTerm)
          window.location.href = '/search-results'
        } else {
          alert(data.error || 'Search failed')
        }
      } catch (error) {
        console.error('Search error:', error)
        alert('Search failed. Please try again.')
      }
    } else {
      // If no state detected and not a license/business search, show an alert
      alert('Please specify a location (e.g., "plumbers in Los Angeles") or search by business name/license number')
    }
  }

  const homePageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Lookup Contractor",
      "description": "Find & verify contractor licenses before you hire! Search official state licensing databases to check credentials, license status, and confirm legitimacy using government data.",
      "url": "https://lookupcontractor.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://lookupcontractor.com/search-results?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Lookup Contractor",
        "url": "https://lookupcontractor.com",
        "description": "Free contractor license verification tool using official state government data"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Lookup Contractor",
      "description": "Free contractor license verification service using official government databases",
      "url": "https://lookupcontractor.com",
      "areaServed": {
        "@type": "State",
        "name": "California",
        "containedInPlace": {
          "@type": "Country",
          "name": "United States"
        }
      },
      "serviceType": "License Verification Service",
      "priceRange": "Free",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Contractor Verification Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Contractor License Lookup",
              "description": "Verify contractor license status using official CSLB data"
            },
            "price": "0",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Contractor Credential Check",
              "description": "Check contractor bond information and disciplinary actions"
            },
            "price": "0",
            "priceCurrency": "USD"
          }
        ]
      },
      "audience": {
        "@type": "Audience",
        "audienceType": "Homeowners, Property Managers, Businesses seeking to verify contractor credentials"
      },
      "provider": {
        "@type": "Organization",
        "name": "Lookup Contractor",
        "url": "https://lookupcontractor.com"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I verify a contractor's license before hiring?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use our free search tool to enter the contractor's business name or license number. We'll instantly show you their current license status, expiration date, bond information, and any disciplinary actions. All data comes directly from the California Contractors State License Board (CSLB) and other official state licensing databases."
          }
        },
        {
          "@type": "Question",
          "name": "Is this contractor license lookup service free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Our contractor license verification tool is completely free to use. We provide access to official government licensing data at no cost to help protect consumers from unlicensed contractors and fraud."
          }
        },
        {
          "@type": "Question",
          "name": "What does CLEAR license status mean?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CLEAR means the contractor has an active, valid license with no current suspensions or restrictions. This is the status you want to see when hiring a contractor. Other statuses like SUSPENDED, EXPIRED, or REVOKED indicate the contractor cannot legally perform work and should be avoided."
          }
        },
        {
          "@type": "Question",
          "name": "Do all contractors need to be licensed in California?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! In California, any contractor performing work over $500 (including labor and materials) must be licensed by the CSLB. Licensed contractors are required to carry workers' compensation insurance and surety bonds to protect consumers. Hiring unlicensed contractors is risky and often illegal."
          }
        }
      ]
    }
  ]

  return (
    <>
      <Head>
        <title>California Contractor License Verification - Find & Verify Before You Hire</title>
        <meta name="description" content="Verify California contractor licenses before you hire! Search 240,000+ CSLB licensed contractors using official state data. Check credentials, license status, and confirm legitimacy instantly." />
        <meta name="keywords" content="contractor license verification, check contractor license, verify contractor credentials, contractor background check, licensed contractors lookup, CSLB license search, contractor legitimacy check, license status verification" />
        <meta property="og:title" content="California Contractor License Verification - Find & Verify Before You Hire" />
        <meta property="og:description" content="Verify California contractor licenses before you hire! Search 240,000+ CSLB licensed contractors using official state data." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lookupcontractor.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="California Contractor License Verification - Find & Verify Before You Hire" />
        <meta name="twitter:description" content="Verify California contractor licenses before you hire! Search 240,000+ CSLB licensed contractors." />
        <link rel="canonical" href="https://lookupcontractor.com" />
        
        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://lookupcontractor.com" />
        
        {/* Core Web Vitals optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Preload critical resources */}
        <link rel="preload" as="fetch" href="/api/search" crossOrigin="anonymous" />
        {homePageSchema.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </Head>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{ padding: '2rem 0', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '0.5rem', margin: 0 }}>
          L<span style={{ 
            display: 'inline-block',
            fontSize: '2.6rem',
            filter: 'hue-rotate(200deg) saturate(1.5)',
            transform: 'scale(1.05)',
            marginLeft: '2px',
            marginRight: '2px'
          }}>👀</span>kup Contractor
        </h1>
        <p style={{ fontSize: '1.5rem', opacity: 0.9, margin: 0 }}>
          California Contractor License Verification - Before You Hire!
        </p>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Smart Search Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '3rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center', color: '#333' }}>
            🔍 Smart Search
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem', fontSize: '1rem' }}>
            Use official CSLB data to find & verify California contractor licenses before you hire. Search by name, business, or license number.
          </p>
          
          <div className="search-container" style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '1.5rem', 
            maxWidth: '800px', 
            margin: '0 auto 1.5rem auto' 
          }}>
            <input
              type="text"
              value={smartSearchTerm}
              onChange={(e) => setSmartSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSmartSearch()}
              placeholder="Find & verify: 'electricians in Los Angeles', 'ABC Construction', or license '1234567'"
              className="search-input"
              style={{ 
                flex: 1,
                padding: '1rem 1.5rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '50px', 
                fontSize: '1.1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                minWidth: 0
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />

            <button 
              onClick={handleSmartSearch}
              disabled={!smartSearchTerm.trim()}
              className="search-button"
              style={{ 
                background: smartSearchTerm.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#9ca3af',
                color: 'white', 
                padding: '1rem 2rem', 
                border: 'none', 
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: smartSearchTerm.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: smartSearchTerm.trim() ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              🔍 Search
            </button>
          </div>

          <style jsx>{`
            @media (max-width: 768px) {
              .search-container {
                flex-direction: column !important;
              }
              
              .search-input {
                width: 100% !important;
              }
              
              .search-button {
                width: 100% !important;
                margin-top: 0.5rem;
              }
            }
            
            @media (max-width: 480px) {
              .search-input {
                font-size: 1rem !important;
                padding: 0.875rem 1.25rem !important;
              }
              
              .search-button {
                font-size: 1rem !important;
                padding: 0.875rem 1.5rem !important;
              }
            }
          `}</style>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#888' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Examples:</strong>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <span style={{ background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                "plumbers in Los Angeles"
              </span>
              <span style={{ background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                "ABC Construction Company"
              </span>
              <span style={{ background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                "1034567" (CA license)
              </span>
              <span style={{ background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                "C-36 plumbers San Diego"
              </span>
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem', fontWeight: 'bold' }}>
              🏛️ What We Do
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#555', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              <strong>Free California contractor license verification</strong> using official CSLB government database
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>
                Search Official Records
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.5 }}>
                We search the California Contractors State License Board (CSLB) official database for real-time license information
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>
                Verify Instantly
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Check license status, bond information, expiration dates, and any disciplinary actions
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>
                Protect Yourself
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Avoid unlicensed contractors and verify credentials before making any hiring decisions
              </p>
            </div>
          </div>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#f0f8ff',
            borderRadius: '8px',
            border: '1px solid #b3d9ff'
          }}>
            <p style={{ color: '#0066cc', fontSize: '1rem', margin: 0, fontWeight: '500' }}>
              <strong>100% Free</strong> • <strong>Official Data</strong> • <strong>240,000+ Contractors</strong> • <strong>Instant Results</strong>
            </p>
          </div>

          {/* Social Proof Section */}
          <div style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.3rem', color: '#333', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              ⭐ Trusted by Homeowners & Businesses Across California
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
                  50,000+
                </div>
                <div style={{ color: '#666', fontSize: '0.95rem' }}>
                  License Verifications Monthly
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.5rem' }}>
                  240,671
                </div>
                <div style={{ color: '#666', fontSize: '0.95rem' }}>
                  Licensed Contractors in Database
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem' }}>
                  99.9%
                </div>
                <div style={{ color: '#666', fontSize: '0.95rem' }}>
                  Data Accuracy from CSLB
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '0.5rem' }}>
                  &lt;1s
                </div>
                <div style={{ color: '#666', fontSize: '0.95rem' }}>
                  Average Search Time
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Browse by State */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '3rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', color: '#333' }}>
            Browse by State
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            Currently serving California with 240,000+ licensed contractors. <strong>Texas coming soon!</strong>
          </p>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <Link href="/state/california">
                <div style={{ 
                  padding: '2rem', 
                  border: '3px solid #059669', 
                  borderRadius: '12px', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  color: '#333',
                  background: '#f0fdf4'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌟</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>California</div>
                  <div style={{ fontSize: '1rem', color: '#059669', fontWeight: '600' }}>
                    ✅ 240,671 Licensed Contractors
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                    Full CSLB database access
                  </div>
                </div>
              </Link>

              <div style={{ 
                padding: '2rem', 
                border: '3px solid #f59e0b', 
                borderRadius: '12px', 
                textAlign: 'center',
                background: '#fffbeb',
                opacity: 0.8
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚧</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Texas</div>
                <div style={{ fontSize: '1rem', color: '#f59e0b', fontWeight: '600' }}>
                  🔜 Coming Soon!
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  Texas Department of Licensing integration in development
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              More states coming soon! <Link href="/contact" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                Request your state
              </Link>
            </p>
          </div>
        </div>

        {/* Browse by Contractor Type */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '3rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', color: '#333' }}>
            Browse by Contractor Type
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            Verify California contractors by their specialty and check CSLB license classifications
          </p>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#555', fontWeight: '600' }}>
              ⭐ Popular Types
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {popularContractorTypes.map(type => (
                <Link key={type.code} href={`/contractors/${type.code.toLowerCase()}`}>
                  <div style={{ 
                    padding: '1.5rem', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    color: '#333',
                    ':hover': {
                      borderColor: '#3b82f6',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>{type.icon}</span>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {type.name}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      Code: {type.code} • {type.count} licensed contractors
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {showAllContractorTypes && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#555', fontWeight: '600' }}>
                🔧 All Contractor Types
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
                {allContractorTypes.map(type => (
                  <Link key={type.code} href={`/contractors/${type.code.toLowerCase()}`}>
                    <div style={{ 
                      padding: '1rem', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                      color: '#333',
                      fontSize: '0.95rem',
                      ':hover': {
                        borderColor: '#3b82f6',
                        backgroundColor: '#f8fafc'
                      }
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{type.icon}</span>
                        <div>
                          <div style={{ fontWeight: '600' }}>{type.code}</div>
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>{type.name}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setShowAllContractorTypes(!showAllContractorTypes)}
              style={{
                background: showAllContractorTypes ? '#6b7280' : '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',  
                transition: 'all 0.2s'
              }}
            >
              {showAllContractorTypes ? 'Show Less Types' : 'Show All Contractor Types'}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <section style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '3rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', color: '#333' }}>
            ❓ California Contractor License Verification FAQ
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            
            <article style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '0.75rem' }}>
                How do I verify a contractor's license before hiring?
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>
                Use our free search tool above to enter the contractor's business name or license number. We'll instantly show you their current license status, 
                expiration date, bond information, and any disciplinary actions. All data comes directly from the California Contractors State License Board (CSLB) 
                and other official state licensing databases.
              </p>
            </article>

            <article style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '0.75rem' }}>
                Is this contractor license lookup service free?
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>
                Yes! Our contractor license verification tool is completely free to use. We provide access to official government licensing data 
                at no cost to help protect consumers from unlicensed contractors and fraud.
              </p>
            </article>

            <article style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '0.75rem' }}>
                What does "CLEAR" license status mean?
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>
                "CLEAR" means the contractor has an active, valid license with no current suspensions or restrictions. 
                This is the status you want to see when hiring a contractor. Other statuses like "SUSPENDED," "EXPIRED," or "REVOKED" 
                indicate the contractor cannot legally perform work and should be avoided.
              </p>
            </article>

            <article style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '0.75rem' }}>
                Do all contractors need to be licensed in California?
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>
                Yes! In California, any contractor performing work over $500 (including labor and materials) must be licensed by the CSLB. 
                Licensed contractors are required to carry workers' compensation insurance and surety bonds to protect consumers. 
                Hiring unlicensed contractors is risky and often illegal.
              </p>
            </article>

            <article style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '0.75rem' }}>
                What's the difference between Class A, B, and C contractor licenses?
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>
                <strong>Class A (General Engineering):</strong> Heavy construction like highways, bridges, and infrastructure projects<br/>
                <strong>Class B (General Building):</strong> Residential and commercial building construction<br/>
                <strong>Class C (Specialty):</strong> Specific trades like C-10 electrical, C-36 plumbing, C-39 roofing, etc.
              </p>
            </article>

            <article style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '0.75rem' }}>
                How current is your contractor license database?
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>
                Our database is regularly updated from official state licensing boards including the CSLB. License statuses, bond information, 
                and disciplinary actions are refreshed frequently to ensure you have current information. However, we always recommend 
                double-checking directly with the licensing board for the most up-to-date status.
              </p>
            </article>

            <article style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '0.75rem' }}>
                Do you support other states besides California?
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>
                Currently, we focus exclusively on California's CSLB database with over 240,000 licensed contractors. 
                <strong>Texas is coming soon!</strong> Each state has different licensing systems and requirements, so we're 
                building state-specific solutions. <Link href="/contact" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Contact us</Link> to 
                request your state.
              </p>
            </article>

            <article style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '0.75rem' }}>
                What should I do if a contractor's license is suspended or expired?
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>
                Do not hire contractors with suspended, expired, or revoked licenses. They cannot legally perform work and you'll have 
                no protection if something goes wrong. Look for contractors with "CLEAR" or "ACTIVE" status only. If you've already 
                been approached by an unlicensed contractor, you can report them to the CSLB.
              </p>
            </article>

          </div>
        </section>

      </div>

      {/* Footer */}
      <footer style={{ 
        background: 'rgba(255,255,255,0.1)', 
        color: 'white', 
        padding: '3rem 2rem 2rem 2rem',
        marginTop: '3rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem', 
            marginBottom: '2rem' 
          }}>
            {/* About Section */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                About Lookup Contractor
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.5, margin: 0 }}>
                Free California contractor license verification using official CSLB data. Protect yourself by checking contractor credentials before you hire - search over 240,000 licensed professionals. Texas coming soon!
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                Quick Links
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/state/california" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, fontSize: '0.9rem' }}>
                  California Contractors
                </Link>
                <Link href="/search-results" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, fontSize: '0.9rem' }}>
                  Advanced Search
                </Link>
                <Link href="/blog" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, fontSize: '0.9rem' }}>
                  Safety Blog
                </Link>
                <Link href="/data-sources" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, fontSize: '0.9rem' }}>
                  Data Sources
                </Link>
                <Link href="/contact" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, fontSize: '0.9rem' }}>
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                Legal & Policies
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/privacy-policy" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, fontSize: '0.9rem' }}>
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, fontSize: '0.9rem' }}>
                  Terms of Service
                </Link>
                <Link href="/disclaimer" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, fontSize: '0.9rem' }}>
                  Disclaimer
                </Link>
                <Link href="/copyright" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, fontSize: '0.9rem' }}>
                  Copyright & IP
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                Get in Touch
              </h3>
              <div style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.5 }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <a href="mailto:contact@lookupcontractor.com" style={{ color: 'white', textDecoration: 'underline' }}>contact@lookupcontractor.com</a>
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                  For all inquiries: general, technical support, business, and legal matters
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div style={{ 
            borderTop: '1px solid rgba(255,255,255,0.2)', 
            paddingTop: '1.5rem', 
            textAlign: 'center',
            fontSize: '0.9rem',
            opacity: 0.8
          }}>
            <p style={{ margin: '0 0 1rem 0' }}>
              © {new Date().getFullYear()} Lookup Contractor. All rights reserved.
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>
              Contractor data sourced from official state licensing boards. Always verify information independently before hiring.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}