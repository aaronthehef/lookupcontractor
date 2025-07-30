import Link from 'next/link'
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
          searchTerm: parsed.term,
          searchType: parsed.type,
          city: parsed.city,
          state: parsed.state || 'california' // Default to CA if no state specified
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

  return (
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
          Find Licensed Contractors Nationwide
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
            Search naturally like Google - try "plumbers in Los Angeles" or enter any license number
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
            <input
              type="text"
              value={smartSearchTerm}
              onChange={(e) => setSmartSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSmartSearch()}
              placeholder="Try: 'electricians in California', 'roofers near Miami', or license number '1234567'"
              style={{ 
                flex: 1,
                padding: '1rem 1.5rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '50px', 
                fontSize: '1.1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                ':focus': { borderColor: '#3b82f6' }
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />

            <button 
              onClick={handleSmartSearch}
              disabled={!smartSearchTerm.trim()}
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
                boxShadow: smartSearchTerm.trim() ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'
              }}
            >
              🔍 Search
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#888' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Examples:</strong>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <span style={{ background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                "plumbers in Los Angeles"
              </span>
              <span style={{ background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                "electricians near Miami"
              </span>
              <span style={{ background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                "1034567" (license)
              </span>
              <span style={{ background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                "solar contractors in Texas"
              </span>
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
            Select a state to find licensed contractors in your area
          </p>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#555', fontWeight: '600' }}>
              🔥 Popular States
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {popularStates.map(state => (
                <Link key={state} href={`/state/${state.toLowerCase().replace(' ', '-')}`}>
                  <div style={{ 
                    padding: '1rem', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    color: '#333',
                    ':hover': {
                      borderColor: '#3b82f6',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{state}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                      {state === 'California' ? '241,671 contractors' : 'Coming soon'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {showAllStates && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#555', fontWeight: '600' }}>
                📍 All States
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {allStates.map(state => (
                  <Link key={state} href={`/state/${state.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div style={{ 
                      padding: '0.75rem', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '6px', 
                      textAlign: 'center',
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
                      {state}
                      {state === 'California' && (
                        <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: '0.25rem' }}>
                          ✓ Available
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setShowAllStates(!showAllStates)}
              style={{
                background: showAllStates ? '#6b7280' : '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {showAllStates ? 'Show Less States' : 'Show All 50 States'}
            </button>
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
            Find contractors by their specialty and license classification
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
          Lookup Contractor - Your trusted source for licensed contractor information nationwide
        </p>
      </footer>
    </div>
  )
}