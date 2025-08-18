import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'
import { createContractorUrl } from '../utils/urlHelpers'
import { getStatusInfo } from '../utils/statusHelper'
import { getContractorTypeInfo } from '../utils/contractorTypes'

export default function CSLBLookup() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!searchTerm.trim()) return
    
    setLoading(true)
    setSearched(true)
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: searchTerm,
          searchType: 'smart',
          state: 'california',
          limit: 20
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResults(data)
      } else {
        setResults({ contractors: [], pagination: { total: 0 } })
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults({ contractors: [], pagination: { total: 0 } })
    } finally {
      setLoading(false)
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter license number, business name, or contractor type..."
                  disabled={loading}
                  style={{ 
                    flex: 1,
                    minWidth: '300px',
                    padding: '1rem', 
                    fontSize: '1.1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    outline: 'none',
                    opacity: loading ? 0.7 : 1
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <button 
                  type="submit"
                  disabled={loading || !searchTerm.trim()}
                  style={{ 
                    background: (loading || !searchTerm.trim()) ? '#9ca3af' : '#059669',
                    color: 'white', 
                    padding: '1rem 2rem', 
                    border: 'none', 
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: (loading || !searchTerm.trim()) ? 'not-allowed' : 'pointer',
                    minWidth: '140px'
                  }}
                >
                  {loading ? '🔄 Searching...' : '🔍 Search CSLB'}
                </button>
              </div>
            </form>

            <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
              Data sourced directly from the California State License Board (CSLB)
            </p>
          </div>

          {/* Search Results */}
          {searched && (
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem',
              marginBottom: '3rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
                🔍 Search Results
              </h2>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
                  <div>Searching CSLB database...</div>
                </div>
              ) : results && results.contractors && results.contractors.length > 0 ? (
                <>
                  <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
                    Found <strong>{results.pagination.total.toLocaleString()}</strong> contractors for "{searchTerm}"
                  </p>
                  
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {results.contractors.map((contractor) => (
                      <Link key={contractor.license_no} href={createContractorUrl(contractor)}>
                        <div style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#3b82f6'
                          e.currentTarget.style.backgroundColor = '#f8fafc'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb'
                          e.currentTarget.style.backgroundColor = 'white'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#059669' }}>
                                {contractor.business_name}
                              </h3>
                              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                License #{contractor.license_no} • {(() => {
                                  const typeInfo = getContractorTypeInfo(contractor.primary_classification)
                                  const tradeName = contractor.trade || typeInfo.name
                                  return `${contractor.primary_classification} - ${tradeName}`
                                })()}
                              </div>
                            </div>
                            
                            {(() => {
                              const statusInfo = getStatusInfo(contractor.primary_status)
                              return (
                                <div style={{
                                  padding: '0.4rem 0.7rem',
                                  borderRadius: '16px',
                                  backgroundColor: statusInfo.bgColor,
                                  border: `1px solid ${statusInfo.color}30`,
                                  color: statusInfo.color,
                                  fontSize: '0.8rem',
                                  fontWeight: 'bold',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {statusInfo.label}
                                </div>
                              )
                            })()}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>Location</div>
                              <div style={{ fontWeight: '600', color: '#334155' }}>
                                {contractor.city}, CA {contractor.zip_code}
                              </div>
                            </div>
                            
                            {contractor.business_phone && (
                              <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>Phone</div>
                                <div style={{ fontWeight: '600', color: '#334155' }}>
                                  {contractor.business_phone}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {results.pagination.total > 20 && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                      <Link href={`/?search=${encodeURIComponent(searchTerm)}`} style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}>
                        View All {results.pagination.total.toLocaleString()} Results
                      </Link>
                    </div>
                  )}
                </>
              ) : searched && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                    No contractors found for "{searchTerm}"
                  </h3>
                  <p style={{ color: '#666', marginBottom: '2rem' }}>
                    Try searching by license number, business name, or contractor type.
                  </p>
                  <button 
                    onClick={() => {
                      setSearched(false)
                      setResults(null)
                      setSearchTerm('')
                    }}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Try Another Search
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Popular Searches - Only show if no search has been made */}
          {!searched && (
            <>
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
                    <button
                      key={contractor.type}
                      onClick={() => {
                        setSearchTerm(contractor.type)
                        handleSearch({ preventDefault: () => {} })
                      }}
                      style={{ 
                        padding: '1rem', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: 'white',
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
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
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