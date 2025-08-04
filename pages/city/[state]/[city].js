import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getStatusInfo } from '../../../utils/statusHelper'
import { createContractorUrl } from '../../../utils/urlHelpers'

export default function CityPage() {
  const router = useRouter()
  const { state, city } = router.query
  const [contractors, setContractors] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedType, setSelectedType] = useState('')
  const [contractorTypes, setContractorTypes] = useState([])

  const contractorsPerPage = 20

  useEffect(() => {
    if (state && city) {
      fetchContractors()
    }
  }, [state, city, currentPage, selectedType])

  useEffect(() => {
    fetchContractorTypes()
  }, [])

  const fetchContractorTypes = async () => {
    try {
      const response = await fetch('/api/state-stats?state=california&allTypes=true')
      const data = await response.json()
      if (data.topTypes) {
        // Convert to the format expected by the dropdown
        const types = data.topTypes.map(type => ({
          code: type.primary_classification,
          name: type.trade || type.primary_classification
        }))
        setContractorTypes(types)
      }
    } catch (error) {
      console.error('Error fetching contractor types:', error)
      // Fallback to hardcoded list if API fails
      setContractorTypes([
        { code: 'B', name: 'General Building' },
        { code: 'A', name: 'General Engineering' },
        { code: 'C-10', name: 'Electrical' },
        { code: 'C-36', name: 'Plumbing' },
        { code: 'C-20', name: 'HVAC' },
        { code: 'C-27', name: 'Landscaping' },
        { code: 'C-33', name: 'Painting' },
        { code: 'C-39', name: 'Roofing' }
      ])
    }
  }

  const fetchContractors = async () => {
    try {
      const params = new URLSearchParams({
        state: state === 'california' ? 'CA' : state.toUpperCase(),
        city: formatCityForQuery(city),
        page: currentPage.toString(),
        limit: contractorsPerPage.toString()
      })
      
      if (selectedType) {
        params.append('type', selectedType)
      }

      const response = await fetch(`/api/contractors?${params.toString()}`)
      const data = await response.json()
      
      if (data.contractors) {
        setContractors(data.contractors)
        setTotalCount(data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching contractors:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCityForQuery = (citySlug) => {
    return citySlug?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || ''
  }

  const formatStateName = (stateSlug) => {
    return stateSlug?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || ''
  }

  const totalPages = Math.ceil(totalCount / contractorsPerPage)
  const cityName = formatCityForQuery(city)
  const stateName = formatStateName(state)

  if (state !== 'california') {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
        <h1>Coming Soon</h1>
        <p>{stateName} contractor data will be available soon.</p>
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
          <div style={{ marginBottom: '1rem' }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>
              ← Home
            </Link>
            <span style={{ margin: '0 0.5rem', opacity: 0.6 }}>/</span>
            <Link href={`/state/${state}`} style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>
              {stateName}
            </Link>
          </div>
          <h1 style={{ fontSize: '3rem', margin: '0.5rem 0', fontWeight: 'bold' }}>
            {cityName} Contractors
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
            {totalCount.toLocaleString()} licensed contractors in {cityName}, {stateName}
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
            Filter by Contractor Type
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value)
                setCurrentPage(1)
              }}
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

            {selectedType && (
              <button 
                onClick={() => {
                  setSelectedType('')
                  setCurrentPage(1)
                }}
                style={{ 
                  background: '#ef4444',
                  color: 'white', 
                  padding: '0.75rem 1rem', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Contractors List */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              Loading contractors...
            </div>
          ) : contractors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              No contractors found for the selected criteria.
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
                Contractors in {cityName}
                {selectedType && (
                  <span style={{ fontSize: '1.2rem', color: '#666', fontWeight: 'normal' }}>
                    {' '}• {contractorTypes.find(t => t.code === selectedType)?.name}
                  </span>
                )}
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