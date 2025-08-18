import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getStatusInfo } from '../utils/statusHelper'
import { createContractorUrl } from '../utils/urlHelpers'

export default function SearchPage() {
  const router = useRouter()
  const { state, type, term } = router.query
  const [contractors, setContractors] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('business')
  const [selectedState, setSelectedState] = useState('')
  const [selectedContractorType, setSelectedContractorType] = useState('')

  const contractorsPerPage = 20

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
    // Initialize from URL parameters
    if (state) setSelectedState(formatStateFromSlug(state))
    if (type) setSelectedContractorType(type)
    if (term) setSearchTerm(term)
    
    // Perform search if we have URL parameters
    if (state || type || term) {
      performSearch()
    } else {
      setLoading(false)
    }
  }, [state, type, term, currentPage])

  const formatStateFromSlug = (stateSlug) => {
    if (!stateSlug) return ''
    // Handle 'california' slug specially to maintain consistency
    if (stateSlug.toLowerCase() === 'california') {
      return 'California'
    }
    return stateSlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const formatStateToSlug = (stateName) => {
    return stateName.toLowerCase().replace(' ', '-')
  }

  const performSearch = async (customParams = {}) => {
    setLoading(true)
    
    try {
      const params = new URLSearchParams()
      
      const searchState = customParams.state || selectedState
      const searchContractorType = customParams.contractorType || selectedContractorType
      const searchTermValue = customParams.term || searchTerm

      // Normalize state name for comparison
      const normalizedState = searchState?.toLowerCase().replace('-', ' ')
      
      if (normalizedState && normalizedState !== 'california') {
        // For non-California states, show coming soon message
        setContractors([])
        setTotalCount(0)
        setLoading(false)
        return
      }

      if (searchState) {
        // For California, use 'CA' regardless of input format
        if (normalizedState === 'california') {
          params.append('state', 'CA')
        } else {
          params.append('state', searchState.toUpperCase())
        }
      }
      if (searchContractorType) {
        params.append('type', searchContractorType)
      }
      if (searchTermValue) {
        params.append('term', searchTermValue)
      }
      
      params.append('page', currentPage.toString())
      params.append('limit', contractorsPerPage.toString())

      const response = await fetch(`/api/contractors?${params.toString()}`)
      const data = await response.json()
      
      if (data.contractors) {
        setContractors(data.contractors)
        setTotalCount(data.total || 0)
      }
    } catch (error) {
      console.error('Error performing search:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    performSearch()
    
    // Update URL
    const params = new URLSearchParams()
    if (selectedState) params.append('state', formatStateToSlug(selectedState))
    if (selectedContractorType) params.append('type', selectedContractorType)
    if (searchTerm) params.append('term', searchTerm)
    
    router.push(`/search?${params.toString()}`, undefined, { shallow: true })
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedState('')
    setSelectedContractorType('')
    setContractors([])
    setTotalCount(0)
    setCurrentPage(1)
    router.push('/search', undefined, { shallow: true })
  }

  const totalPages = Math.ceil(totalCount / contractorsPerPage)
  const hasSearchCriteria = selectedState || selectedContractorType || searchTerm

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
            Search Contractors
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
            {totalCount > 0 ? `${totalCount.toLocaleString()} contractors found` : 'Find licensed contractors nationwide'}
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Search Form */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333' }}>
            Search Criteria
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                State
              </label>
              <select 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select State</option>
                {allStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Contractor Type
              </label>
              <select
                value={selectedContractorType}
                onChange={(e) => setSelectedContractorType(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="">All Types</option>
                {contractorTypes.map(type => (
                  <option key={type.code} value={type.code}>
                    {type.code} - {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Search Type
              </label>
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="business">Business Name</option>
                <option value="license">License Number</option>
                <option value="city">City</option>
                <option value="classification">Classification</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Search Term
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Enter ${searchType === 'license' ? 'license number' : 
                               searchType === 'business' ? 'business name' :
                               searchType === 'city' ? 'city name' : 'classification'}`}
                style={{ 
                  width: '100%',
                  padding: '0.75rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '8px', 
                  fontSize: '1rem'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleSearch}
              disabled={!hasSearchCriteria}
              style={{ 
                background: hasSearchCriteria ? '#3b82f6' : '#9ca3af',
                color: 'white', 
                padding: '0.75rem 2rem', 
                border: 'none', 
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: hasSearchCriteria ? 'pointer' : 'not-allowed'
              }}
            >
              Search Contractors
            </button>

            {hasSearchCriteria && (
              <button 
                onClick={clearSearch}
                style={{ 
                  background: '#6b7280',
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {!hasSearchCriteria ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Search for Contractors</h3>
              <p>Select search criteria above to find licensed contractors.</p>
            </div>
          ) : selectedState && selectedState !== 'California' ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Coming Soon</h3>
              <p>{selectedState} contractor data will be available soon.</p>
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              Searching contractors...
            </div>
          ) : contractors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Results Found</h3>
              <p>No contractors found matching your search criteria. Try adjusting your search terms.</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
                Search Results ({totalCount.toLocaleString()})
              </h2>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {contractors.map(contractor => (
                  <Link key={contractor.id} href={createContractorUrl(contractor)}>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, marginRight: '1rem' }}>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                            {contractor.business_name}
                          </h3>
                          <div style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>
                            License #{contractor.license_no} • {contractor.primary_classification}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#888' }}>
                            {contractor.mailing_address && `${contractor.mailing_address} • `}
                            {contractor.city}, {contractor.state} {contractor.zip_code}
                          </div>
                        </div>
                        {(() => {
                          const statusInfo = getStatusInfo(contractor.primary_status)
                          return (
                            <div style={{
                              background: statusInfo.bgColor,
                              color: statusInfo.color,
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              cursor: 'help',
                              title: statusInfo.description
                            }}>
                              <span>{statusInfo.icon}</span>
                              <span>{statusInfo.label}</span>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                      background: currentPage === 1 ? '#e5e7eb' : '#3b82f6',
                      color: currentPage === 1 ? '#9ca3af' : 'white',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Previous
                  </button>

                  <span style={{ color: '#666' }}>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      background: currentPage === totalPages ? '#e5e7eb' : '#3b82f6',
                      color: currentPage === totalPages ? '#9ca3af' : 'white',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}