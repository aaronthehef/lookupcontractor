import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('license')
  const [selectedState, setSelectedState] = useState('')

  const states = [
    'California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania',
    'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia',
    'Washington', 'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri',
    'Maryland', 'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama'
  ]

  const contractorTypes = [
    { code: 'B', name: 'General Building Contractor', count: '100,583' },
    { code: 'A', name: 'General Engineering Contractor', count: '15,242' },
    { code: 'C-10', name: 'Electrical Contractor', count: '20,234' },
    { code: 'C-36', name: 'Plumbing Contractor', count: '11,540' },
    { code: 'C-20', name: 'HVAC Contractor', count: '8,865' },
    { code: 'C-27', name: 'Landscaping Contractor', count: '10,102' },
    { code: 'C-33', name: 'Painting Contractor', count: '12,792' },
    { code: 'C-39', name: 'Roofing Contractor', count: '3,817' }
  ]

  const handleQuickSearch = () => {
    if (selectedState && searchTerm) {
      const stateCode = selectedState.toLowerCase().replace(' ', '-')
      window.location.href = `/search?state=${stateCode}&type=${searchType}&term=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{ padding: '2rem 0', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '0.5rem', margin: 0 }}>
          ContractorHub
        </h1>
        <p style={{ fontSize: '1.5rem', opacity: 0.9, margin: 0 }}>
          Find Licensed Contractors Nationwide
        </p>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Quick Search Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '3rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', color: '#333' }}>
            Quick Search
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{ 
                padding: '0.75rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{ 
                padding: '0.75rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="business">Business Name</option>
              <option value="license">License Number</option>
              <option value="city">City</option>
              <option value="classification">Contractor Type</option>
            </select>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Enter ${searchType === 'license' ? 'license number' : 
                           searchType === 'business' ? 'business name' :
                           searchType === 'city' ? 'city name' : 'contractor type'}`}
              style={{ 
                padding: '0.75rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '8px', 
                fontSize: '1rem'
              }}
            />

            <button 
              onClick={handleQuickSearch}
              disabled={!selectedState || !searchTerm}
              style={{ 
                background: selectedState && searchTerm ? '#3b82f6' : '#9ca3af',
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: selectedState && searchTerm ? 'pointer' : 'not-allowed'
              }}
            >
              Search Contractors
            </button>
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
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', color: '#333' }}>
            Browse by State
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {states.slice(0, 12).map(state => (
              <Link key={state} href={`/state/${state.toLowerCase().replace(' ', '-')}`}>
                <div style={{ 
                  padding: '1rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  color: '#333'
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

        {/* Browse by Contractor Type */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '3rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', color: '#333' }}>
            Popular Contractor Types
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {contractorTypes.map(type => (
              <Link key={type.code} href={`/contractors/${type.code.toLowerCase()}`}>
                <div style={{ 
                  padding: '1.5rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  color: '#333'
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {type.name}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Code: {type.code} • {type.count} licensed contractors
                  </div>
                </div>
              </Link>
            ))}
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
          ContractorHub - Your trusted source for licensed contractor information nationwide
        </p>
      </footer>
    </div>
  )
}