import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function StatePage() {
  const router = useRouter()
  const { state } = router.query
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('')

  const contractorTypes = [
    { code: 'B', name: 'General Building' },
    { code: 'A', name: 'General Engineering' },
    { code: 'C-10', name: 'Electrical' },
    { code: 'C-36', name: 'Plumbing' },
    { code: 'C-20', name: 'HVAC' },
    { code: 'C-27', name: 'Landscaping' },
    { code: 'C-33', name: 'Painting' },
    { code: 'C-39', name: 'Roofing' }
  ]

  useEffect(() => {
    if (state === 'california') {
      fetchCities()
    }
  }, [state])

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities')
      const data = await response.json()
      setCities(data.cities || [])
    } catch (error) {
      console.error('Error fetching cities:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatStateName = (stateSlug) => {
    return stateSlug?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || ''
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedType) params.append('type', selectedType)
    router.push(`/search?state=${state}&${params.toString()}`)
  }

  if (state !== 'california') {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
        <h1>Coming Soon</h1>
        <p>{formatStateName(state)} contractor data will be available soon.</p>
        <Link href="/">
          <button style={{ 
            background: '#3b82f6', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Back to Home
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '2rem 0' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontSize: '3rem', margin: '1rem 0 0.5rem 0' }}>
            {formatStateName(state)} Contractors
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
            241,671 licensed contractors across California
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Filter Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            Find Contractors by Type
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ 
                padding: '0.75rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '1rem',
                minWidth: '200px'
              }}
            >
              <option value="">All Contractor Types</option>
              {contractorTypes.map(type => (
                <option key={type.code} value={type.code}>
                  {type.code} - {type.name}
                </option>
              ))}
            </select>

            <button 
              onClick={handleSearch}
              style={{ 
                background: '#3b82f6',
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Search Contractors
            </button>
          </div>
        </div>

        {/* Cities Grid */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
            Browse by City
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Loading cities...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {cities.map(city => (
                <Link key={city.city} href={`/city/${state}/${city.city.toLowerCase().replace(/\s+/g, '-')}`}>
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
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {city.city}
                    </div>
                    <div style={{ fontSize: '1rem', color: '#666' }}>
                      {city.count.toLocaleString()} contractors
                    </div>
                    {city.county && (
                      <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.25rem' }}>
                        {city.county} County
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}