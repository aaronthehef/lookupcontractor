import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SearchResults() {
  const [results, setResults] = useState(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [contractorsPerPage] = useState(10)
  
  // Filter states
  const [selectedCity, setSelectedCity] = useState('')
  const [activeOnly, setActiveOnly] = useState(true)
  const [hasPhoneOnly, setHasPhoneOnly] = useState(false)
  const [sortBy, setSortBy] = useState('business_name')

  useEffect(() => {
    // Get results from localStorage
    const searchResults = localStorage.getItem('searchResults')
    const searchQuery = localStorage.getItem('searchQuery')
    
    if (searchResults && searchQuery) {
      setResults(JSON.parse(searchResults))
      setQuery(searchQuery)
    }
    
    setLoading(false)
  }, [])

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'
  }

  const getStatusColor = (status) => {
    if (status?.includes('ACTIVE')) return '#059669'
    if (status?.includes('EXPIRED')) return '#dc2626'
    if (status?.includes('SUSPENDED')) return '#d97706'
    return '#6b7280'
  }

  // Filter and sort contractors
  const getFilteredContractors = () => {
    if (!results?.contractors) return []
    
    let filtered = results.contractors.filter(contractor => {
      // City filter
      if (selectedCity && contractor.city !== selectedCity) return false
      
      // Active licenses only
      if (activeOnly && contractor.primary_status !== 'CLEAR') return false
      
      // Has phone number
      if (hasPhoneOnly && !contractor.business_phone) return false
      
      return true
    })
    
    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'business_name':
          return (a.business_name || '').localeCompare(b.business_name || '')
        case 'license_no':
          return (a.license_no || '').localeCompare(b.license_no || '')
        case 'city':
          return (a.city || '').localeCompare(b.city || '')
        case 'expiration_date':
          return new Date(b.expiration_date || 0) - new Date(a.expiration_date || 0)
        default:
          return 0
      }
    })
    
    return filtered
  }

  // Get unique cities from results
  const getUniqueCities = () => {
    if (!results?.contractors) return []
    const cities = [...new Set(results.contractors.map(c => c.city).filter(Boolean))]
    return cities.sort()
  }

  const filteredContractors = getFilteredContractors()
  const uniqueCities = getUniqueCities()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading...</div>
      </div>
    )
  }

  if (!results) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>
          <div>No search results found</div>
          <Link href="/" style={{ color: '#ffeb3b', textDecoration: 'underline', fontSize: '1.2rem', marginTop: '1rem', display: 'block' }}>
            ← Back to Search
          </Link>
        </div>
      </div>
    )
  }

  return (
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
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Search Results Header */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>
              Search Results
            </h2>
            <Link href="/" style={{ 
              background: '#3b82f6', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              🔍 New Search
            </Link>
          </div>
          
          <div style={{ color: '#666', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            <strong>Query:</strong> "{query}"
          </div>
          <div style={{ color: '#666', fontSize: '1rem' }}>
            Found <strong>{results.contractors?.length || 0}</strong> contractors • Showing <strong>{filteredContractors.length}</strong> after filters • Page {currentPage} of {Math.ceil(filteredContractors.length / contractorsPerPage)}
          </div>
        </div>

        {/* Filters */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333', display: 'flex', alignItems: 'center' }}>
            🎯 <span style={{ marginLeft: '0.5rem' }}>Filters</span>
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            {/* City Filter */}
            <div>
              <label style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem', display: 'block' }}>
                📍 City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value)
                  setCurrentPage(1) // Reset to first page when filtering
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.95rem'
                }}
              >
                <option value="">All Cities ({uniqueCities.length})</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Active Licenses Only */}
            <div>
              <label style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem', display: 'block' }}>
                📋 License Status
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                <input
                  type="checkbox"
                  checked={activeOnly}
                  onChange={(e) => {
                    setActiveOnly(e.target.checked)
                    setCurrentPage(1)
                  }}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ fontSize: '0.95rem' }}>Active licenses only</span>
              </label>
            </div>

            {/* Has Phone Number */}
            <div>
              <label style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem', display: 'block' }}>
                📞 Contact Info
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                <input
                  type="checkbox"
                  checked={hasPhoneOnly}
                  onChange={(e) => {
                    setHasPhoneOnly(e.target.checked)
                    setCurrentPage(1)
                  }}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ fontSize: '0.95rem' }}>Has phone number</span>
              </label>
            </div>

            {/* Sort By */}
            <div>
              <label style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem', display: 'block' }}>
                🔤 Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.95rem'
                }}
              >
                <option value="business_name">Business Name A-Z</option>
                <option value="city">City A-Z</option>
                <option value="license_no">License Number</option>
                <option value="expiration_date">License Expiration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '3rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          {filteredContractors && filteredContractors.length > 0 ? (
            <>
              {/* Pagination Navigation - Top */}
              {filteredContractors.length > contractorsPerPage && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: currentPage === 1 ? '#f9fafb' : 'white',
                      color: currentPage === 1 ? '#9ca3af' : '#374151',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    ← Previous
                  </button>
                  
                  <span style={{ padding: '0 1rem', color: '#6b7280' }}>
                    Page {currentPage} of {Math.ceil(filteredContractors.length / contractorsPerPage)}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(Math.ceil(filteredContractors.length / contractorsPerPage), currentPage + 1))}
                    disabled={currentPage === Math.ceil(filteredContractors.length / contractorsPerPage)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: currentPage === Math.ceil(filteredContractors.length / contractorsPerPage) ? '#f9fafb' : 'white',
                      color: currentPage === Math.ceil(filteredContractors.length / contractorsPerPage) ? '#9ca3af' : '#374151',
                      cursor: currentPage === Math.ceil(filteredContractors.length / contractorsPerPage) ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {filteredContractors.slice((currentPage - 1) * contractorsPerPage, currentPage * contractorsPerPage).map((contractor, index) => (
                <div key={contractor.id || index} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  transition: 'all 0.2s',
                  ':hover': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>
                        <Link href={`/contractor/${contractor.license_no}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                          {contractor.business_name || 'Unnamed Business'}
                        </Link>
                      </h3>
                      <div style={{ color: '#666', fontSize: '1rem' }}>
                        License: <strong>{contractor.license_no}</strong>
                      </div>
                    </div>
                    <div style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      backgroundColor: getStatusColor(contractor.primary_status) + '20',
                      color: getStatusColor(contractor.primary_status),
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      {formatStatus(contractor.primary_status)}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.25rem' }}>Location</div>
                      <div style={{ fontWeight: '600' }}>
                        {contractor.city}, CA {contractor.zip_code}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.25rem' }}>Classification</div>
                      <div style={{ fontWeight: '600' }}>
                        {contractor.primary_classification} - {contractor.trade}
                      </div>
                    </div>

                    {contractor.business_phone && (
                      <div>
                        <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.25rem' }}>Phone</div>
                        <div style={{ fontWeight: '600' }}>
                          {contractor.business_phone}
                        </div>
                      </div>
                    )}
                  </div>

                  {contractor.expiration_date && (
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      License expires: {new Date(contractor.expiration_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
              </div>
              
              {/* Pagination Navigation - Bottom */}
              {filteredContractors.length > contractorsPerPage && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: currentPage === 1 ? '#f9fafb' : 'white',
                      color: currentPage === 1 ? '#9ca3af' : '#374151',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    ← Previous
                  </button>
                  
                  <span style={{ padding: '0 1rem', color: '#6b7280' }}>
                    Page {currentPage} of {Math.ceil(filteredContractors.length / contractorsPerPage)}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(Math.ceil(filteredContractors.length / contractorsPerPage), currentPage + 1))}
                    disabled={currentPage === Math.ceil(filteredContractors.length / contractorsPerPage)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: currentPage === Math.ceil(filteredContractors.length / contractorsPerPage) ? '#f9fafb' : 'white',
                      color: currentPage === Math.ceil(filteredContractors.length / contractorsPerPage) ? '#9ca3af' : '#374151',
                      cursor: currentPage === Math.ceil(filteredContractors.length / contractorsPerPage) ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <div>No contractors found matching your search criteria.</div>
              <div style={{ marginTop: '1rem', fontSize: '1rem' }}>
                Try searching with broader terms or a different location.
              </div>
            </div>
          )}
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