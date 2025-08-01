import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Breadcrumbs from '../components/Breadcrumbs'
import { createContractorUrl } from '../utils/slugify'
import { getStatusInfo } from '../utils/statusHelper'

export default function SearchResults() {
  const router = useRouter()
  const [results, setResults] = useState(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [contractorsPerPage] = useState(10)
  
  // Get current page from URL, default to 1
  const currentPage = parseInt(router.query.page) || 1
  
  // Filter states
  const [selectedCity, setSelectedCity] = useState('')
  const [activeOnly, setActiveOnly] = useState(true)
  const [hasPhoneOnly, setHasPhoneOnly] = useState(false)
  const [sortBy, setSortBy] = useState('business_name')

  useEffect(() => {
    console.log('=== SEARCH RESULTS USEEFFECT ===')
    try {
      // Get search query from localStorage
      const searchQuery = localStorage.getItem('searchQuery')
      console.log('Search query from localStorage:', searchQuery)
      console.log('Current page:', currentPage)
      
      if (searchQuery) {
        setQuery(searchQuery)
        setLoading(true)
        // Make fresh API call with current page
        fetchFreshResults(searchQuery, currentPage)
      } else {
        console.log('No search query found, stopping loading')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error in useEffect:', error)
      setLoading(false)
    }
  }, [currentPage])

  const fetchFreshResults = async (searchQuery, page = 1) => {
    console.log('=== FRONTEND DEBUG ===')
    console.log('Making fresh API call for:', searchQuery, 'page:', page)
    
    try {
      const requestBody = {
        searchTerm: searchQuery,
        searchType: 'smart',
        state: 'california',
        page: page,
        limit: 10  // Use 10 per page for proper pagination
      }
      
      console.log('Request body:', requestBody)
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      console.log('Response status:', response.status)
      
      const data = await response.json()
      
      console.log('API response total:', data.pagination?.total)
      console.log('API response contractors count:', data.contractors?.length)
      console.log('API response pages:', data.pagination?.totalPages)
      
      if (response.ok) {
        console.log('Setting fresh results from API')
        setResults(data)
        // Update localStorage with fresh results
        localStorage.setItem('searchResults', JSON.stringify(data))
      } else {
        console.error('Search API error:', data.error)
        console.log('Falling back to localStorage')
        // Fall back to localStorage if API fails
        const searchResults = localStorage.getItem('searchResults')
        if (searchResults) {
          const cached = JSON.parse(searchResults)
          console.log('Using cached results, total:', cached.pagination?.total)
          setResults(cached)
        }
      }
    } catch (error) {
      console.error('Fetch error:', error)
      console.log('Error occurred, falling back to localStorage')
      // Fall back to localStorage if fetch fails
      const searchResults = localStorage.getItem('searchResults')
      if (searchResults) {
        const cached = JSON.parse(searchResults)
        console.log('Using cached results after error, total:', cached.pagination?.total)
        setResults(cached)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'
  }

  const getStatusColor = (status) => {
    if (status?.includes('ACTIVE')) return '#059669'
    if (status?.includes('EXPIRED')) return '#dc2626'
    if (status?.includes('SUSPENDED')) return '#d97706'
    return '#6b7280'
  }

  // For server-side pagination, we show all contractors from the API response
  // Filtering should be done on the server side for better performance with large datasets
  const getDisplayContractors = () => {
    if (!results?.contractors) return []
    
    // For now, show all contractors from the current page
    // TODO: Move filtering to server side for better performance
    let filtered = results.contractors.filter(contractor => {
      // City filter
      if (selectedCity && contractor.city !== selectedCity) return false
      
      // Active licenses only (include CLEAR, ACTIVE, and null statuses - null typically means active)
      if (activeOnly && contractor.primary_status && !['CLEAR', 'ACTIVE'].includes(contractor.primary_status)) return false
      
      // Has phone number
      if (hasPhoneOnly && !contractor.business_phone) return false
      
      return true
    })
    
    return filtered
  }

  // Get unique cities from results
  const getUniqueCities = () => {
    if (!results?.contractors) return []
    const cities = [...new Set(results.contractors.map(c => c.city).filter(Boolean))]
    return cities.sort()
  }

  const displayContractors = getDisplayContractors()
  const uniqueCities = getUniqueCities()

  // Generate SEO content using server pagination data
  const totalResults = results?.pagination?.total || 0
  const displayedCount = displayContractors.length
  const totalPages = results?.pagination?.totalPages || 1
  
  const pageTitle = `${query} - ${totalResults} Licensed Contractors Found${currentPage > 1 ? ` - Page ${currentPage}` : ''}`
  const metaDescription = `Find ${totalResults} licensed contractors for "${query}". Compare licenses, ratings, contact info & more. Page ${currentPage} of ${totalPages}.`
  
  // Generate breadcrumbs for search results
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Search Results' },
    ...(currentPage > 1 ? [{ label: `Page ${currentPage}` }] : [])
  ]

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
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${query}, licensed contractors, contractor search, license verification`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://lookupcontractor.com/search-results${currentPage > 1 ? `?page=${currentPage}` : ''}`} />
        {currentPage > 1 && <link rel="prev" href={`https://lookupcontractor.com/search-results?page=${currentPage - 1}`} />}
        {currentPage < totalPages && <link rel="next" href={`https://lookupcontractor.com/search-results?page=${currentPage + 1}`} />}
        <meta name="robots" content={currentPage > 10 ? "noindex,follow" : "index,follow"} />
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
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
        
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
            Found <strong>{totalResults}</strong> contractors • Showing <strong>{displayedCount}</strong> on page {currentPage} of {totalPages}
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
                  // Navigate to page 1 with new filters
                  router.push('/search-results?page=1', undefined, { shallow: true })
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
                    router.push('/search-results?page=1', undefined, { shallow: true })
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
                    router.push('/search-results?page=1', undefined, { shallow: true })
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
          {displayContractors && displayContractors.length > 0 ? (
            <>
              {/* Pagination Navigation - Top */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                  {currentPage > 1 ? (
                    <Link href={`/search-results?page=${currentPage - 1}`} style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: 'white',
                      color: '#374151',
                      textDecoration: 'none',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      ← Previous
                    </Link>
                  ) : (
                    <span style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: '#f9fafb',
                      color: '#9ca3af',
                      fontWeight: '500'
                    }}>
                      ← Previous
                    </span>
                  )}
                  
                  <span style={{ padding: '0 1rem', color: '#6b7280' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  {currentPage < totalPages ? (
                    <Link href={`/search-results?page=${currentPage + 1}`} style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: 'white',
                      color: '#374151',
                      textDecoration: 'none',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      Next →
                    </Link>
                  ) : (
                    <span style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: '#f9fafb',
                      color: '#9ca3af',
                      fontWeight: '500'
                    }}>
                      Next →
                    </span>
                  )}
                </div>
              )}

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {displayContractors.map((contractor, index) => (
                <div key={contractor.id || index} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '0',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'
                  e.currentTarget.style.borderColor = '#3b82f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }}
                >
                  {/* Card Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: 'bold', 
                          color: '#1e293b', 
                          marginBottom: '0.5rem',
                          lineHeight: '1.3',
                          wordWrap: 'break-word'
                        }}>
                          <Link href={createContractorUrl(contractor.license_no, contractor.business_name)} style={{ 
                            color: '#3b82f6', 
                            textDecoration: 'none',
                            display: 'block'
                          }}>
                            {contractor.business_name || 'Unnamed Business'}
                          </Link>
                        </h3>
                        <div style={{ 
                          color: '#64748b', 
                          fontSize: '0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          🏆 License: <strong style={{ color: '#475569' }}>{contractor.license_no}</strong>
                        </div>
                      </div>
                      {(() => {
                        const statusInfo = getStatusInfo(contractor.primary_status)
                        return (
                          <div style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '20px',
                            backgroundColor: statusInfo.bgColor,
                            border: `1px solid ${statusInfo.color}30`,
                            color: statusInfo.color,
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            letterSpacing: '0.5px',
                            marginLeft: '1rem',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <span>{statusInfo.icon}</span>
                            <span>{statusInfo.label}</span>
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr',
                      gap: '1rem', 
                      marginBottom: '1.5rem' 
                    }}>
                      {/* Location */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ fontSize: '1.2rem' }}>📍</div>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Location</div>
                          <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>
                            {contractor.city}, CA {contractor.zip_code}
                          </div>
                        </div>
                      </div>
                      
                      {/* Classification */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: '#f0f9ff',
                        borderRadius: '8px',
                        border: '1px solid #e0f2fe'
                      }}>
                        <div style={{ fontSize: '1.2rem' }}>🔧</div>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: '#0369a1', marginBottom: '0.25rem' }}>Specialty</div>
                          <div style={{ fontWeight: '600', color: '#0c4a6e', fontSize: '0.95rem' }}>
                            {contractor.primary_classification} - {contractor.trade}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Action Section */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      {contractor.business_phone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ fontSize: '1.1rem' }}>📞</div>
                          <a href={`tel:${contractor.business_phone}`} style={{
                            color: '#059669',
                            fontWeight: 'bold',
                            fontSize: '1.05rem',
                            textDecoration: 'none'
                          }}>
                            {contractor.business_phone}
                          </a>
                        </div>
                      ) : (
                        <div style={{ color: '#9ca3af', fontSize: '0.9rem', fontStyle: 'italic' }}>
                          No phone listed
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {contractor.business_phone && (
                          <a href={`tel:${contractor.business_phone}`} style={{
                            background: '#059669',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            📞 Call Now
                          </a>
                        )}
                        <Link href={createContractorUrl(contractor.license_no, contractor.business_name)} style={{
                          background: '#3b82f6',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          📋 Details
                        </Link>
                      </div>
                    </div>

                    {contractor.expiration_date && (
                      <div style={{ 
                        fontSize: '0.85rem', 
                        color: '#64748b',
                        marginTop: '1rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        ⏰ License expires: {new Date(contractor.expiration_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
              
              {/* Pagination Navigation - Bottom */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
                  {currentPage > 1 ? (
                    <Link href={`/search-results?page=${currentPage - 1}`} style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: 'white',
                      color: '#374151',
                      textDecoration: 'none',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      ← Previous
                    </Link>
                  ) : (
                    <span style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: '#f9fafb',
                      color: '#9ca3af',
                      fontWeight: '500'
                    }}>
                      ← Previous
                    </span>
                  )}
                  
                  <span style={{ padding: '0 1rem', color: '#6b7280' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  {currentPage < totalPages ? (
                    <Link href={`/search-results?page=${currentPage + 1}`} style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: 'white',
                      color: '#374151',
                      textDecoration: 'none',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      Next →
                    </Link>
                  ) : (
                    <span style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: '#f9fafb',
                      color: '#9ca3af',
                      fontWeight: '500'
                    }}>
                      Next →
                    </span>
                  )}
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
    </>
  )
}