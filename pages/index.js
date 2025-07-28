import { useState } from 'react'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('license')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError('')
    setResults([])

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: searchTerm.trim(),
          searchType
        }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.contractors || [])
      
      if (data.contractors?.length === 0) {
        setError('No contractors found for your search')
      }
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatPhone = (phone) => {
    if (!phone) return 'N/A'
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' }}>
        Lookup Contractor
      </h1>
      <p style={{ fontSize: '1.25rem', textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Search California State License Board (CSLB) Database
      </p>

      <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="license">License Number</option>
            <option value="business">Business Name</option>
            <option value="city">City</option>
            <option value="classification">Classification</option>
          </select>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Enter ${searchType === 'license' ? 'license number' : 
                         searchType === 'business' ? 'business name' :
                         searchType === 'city' ? 'city name' : 'classification code'}`}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              border: '2px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '1rem' 
            }}
            disabled={loading}
          />
          
          <button 
            type="submit" 
            style={{ 
              background: '#3b82f6', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              border: 'none', 
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#dc2626', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Searching contractors...
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Found {results.length} contractor{results.length !== 1 ? 's' : ''}
          </p>
          
          <div>
            {results.map((contractor) => (
              <div key={contractor.id} style={{ 
                background: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '1.5rem', 
                marginBottom: '1rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {contractor.business_name}
                </div>
                
                <div style={{ color: '#666', lineHeight: 1.6 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    <div>
                      <strong>License #:</strong> {contractor.license_no}<br />
                      <strong>Classification:</strong> {contractor.primary_classification || 'N/A'}<br />
                      <strong>Trade:</strong> {contractor.trade || 'N/A'}<br />
                      <strong>Status:</strong> 
                      <span style={{ 
                        color: contractor.primary_status === 'CLEAR' ? '#059669' : '#dc2626',
                        fontWeight: 600
                      }}>
                        {contractor.primary_status || 'N/A'}
                      </span>
                    </div>
                    
                    <div>
                      <strong>Address:</strong> {contractor.mailing_address || 'N/A'}<br />
                      <strong>City:</strong> {contractor.city}, {contractor.county || ''}<br />
                      <strong>ZIP:</strong> {contractor.zip_code || 'N/A'}<br />
                      <strong>Phone:</strong> {formatPhone(contractor.business_phone)}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                    <strong>Issue Date:</strong> {formatDate(contractor.issue_date)} | 
                    <strong> Expiration:</strong> {formatDate(contractor.expiration_date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}