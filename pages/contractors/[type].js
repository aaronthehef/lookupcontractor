import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getStatusInfo } from '../../utils/statusHelper'
import { createContractorUrl } from '../../utils/urlHelpers'

export default function ContractorTypePage() {
  const router = useRouter()
  const { type } = router.query
  const [contractors, setContractors] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedState, setSelectedState] = useState('California')

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

  const contractorTypes = {
    'b': { code: 'B', name: 'General Building Contractor', description: 'General building contractors handle a wide range of construction projects including residential, commercial, and industrial buildings.' },
    'a': { code: 'A', name: 'General Engineering Contractor', description: 'General engineering contractors specialize in infrastructure projects such as highways, bridges, sewers, and other civil engineering works.' },
    'c-10': { code: 'C-10', name: 'Electrical Contractor', description: 'Electrical contractors install, maintain, and repair electrical systems in residential, commercial, and industrial settings.' },
    'c-36': { code: 'C-36', name: 'Plumbing Contractor', description: 'Plumbing contractors install, repair, and maintain water supply lines, fixtures, and drainage systems.' },
    'c-20': { code: 'C-20', name: 'HVAC Contractor', description: 'HVAC contractors specialize in heating, ventilation, and air conditioning systems for residential and commercial properties.' },
    'c-27': { code: 'C-27', name: 'Landscaping Contractor', description: 'Landscaping contractors provide services including lawn care, garden design, irrigation systems, and outdoor construction.' },
    'c-33': { code: 'C-33', name: 'Painting Contractor', description: 'Painting contractors provide interior and exterior painting services for residential, commercial, and industrial properties.' },
    'c-39': { code: 'C-39', name: 'Roofing Contractor', description: 'Roofing contractors install, repair, and maintain roofing systems for residential and commercial buildings.' }
  }

  useEffect(() => {
    if (type) {
      fetchContractors()
    }
  }, [type, currentPage, selectedState])

  const fetchContractors = async () => {
    try {
      if (selectedState !== 'California') {
        setContractors([])
        setTotalCount(0)
        setLoading(false)
        return
      }

      const params = new URLSearchParams({
        state: 'CA',
        type: type.toString().toUpperCase(),
        page: currentPage.toString(),
        limit: contractorsPerPage.toString()
      })

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

  const typeInfo = contractorTypes[type?.toString().toLowerCase()]
  const totalPages = Math.ceil(totalCount / contractorsPerPage)

  if (!typeInfo) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
        <h1>Contractor Type Not Found</h1>
        <p>The specified contractor type was not found.</p>
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
        padding: '3rem 0' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontSize: '3rem', margin: '1rem 0 0.5rem 0', fontWeight: 'bold' }}>
            {typeInfo.name}
          </h1>
          <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '1rem' }}>
            License Code: {typeInfo.code}
            {selectedState === 'California' && totalCount > 0 && (
              <span> • {totalCount.toLocaleString()} licensed contractors</span>
            )}
          </div>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: 0, lineHeight: 1.6, maxWidth: '800px' }}>
            {typeInfo.description}
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* State Filter */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            Select State
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value)
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
              {allStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            
            {selectedState !== 'California' && (
              <div style={{ 
                background: '#fef3c7', 
                color: '#92400e', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}>
                {selectedState} data coming soon
              </div>
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
          {selectedState !== 'California' ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Coming Soon</h3>
              <p>{selectedState} contractor data will be available soon. Currently showing California contractors only.</p>
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              Loading contractors...
            </div>
          ) : contractors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Contractors Found</h3>
              <p>No {typeInfo.name.toLowerCase()}s found in {selectedState}.</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
                {typeInfo.name}s in {selectedState}
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
                          {contractor.business_phone && (
                            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                              Phone: {contractor.business_phone}
                            </div>
                          )}
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