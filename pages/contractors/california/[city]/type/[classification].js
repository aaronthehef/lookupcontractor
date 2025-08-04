import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Breadcrumbs from '../../../../../components/Breadcrumbs'
import { createContractorUrl } from '../../../../../utils/urlHelpers'
import { getContractorTypeInfo } from '../../../../../utils/contractorTypes'
import { getStatusInfo } from '../../../../../utils/statusHelper'

export default function CityContractorTypePage() {
  const router = useRouter()
  const { city, classification } = router.query
  const [contractors, setContractors] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const contractorsPerPage = 24

  useEffect(() => {
    if (city && classification) {
      fetchCityContractorsByType()
    }
  }, [city, classification])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    // Scroll to top of contractor list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fetchCityContractorsByType = async () => {
    try {
      // Convert city slug to proper format for search
      const cityName = decodeURIComponent(city).replace(/-/g, ' ')
      
      // First search by classification to get all contractors of this type
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: classification.toUpperCase(),
          searchType: 'classification',
          state: 'california',
          limit: 10000
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.contractors) {
        // Debug: Check what classifications are in the results
        const classificationsInResults = [...new Set(data.contractors.map(c => c.primary_classification))]
        console.log(`Classifications in API results:`, classificationsInResults)
        console.log(`Searching for classification: "${classification.toUpperCase()}"`)
        
        // Filter contractors to match both the specific city AND classification
        // Cities are stored as "SAN DIEGO" in database, URL comes as "san-diego"
        const targetCityUpper = cityName.toUpperCase().trim()
        const targetClassification = classification.toUpperCase().trim()
        
        const filteredContractors = data.contractors.filter(c => {
          const contractorCity = c.city?.trim()
          const contractorClassification = c.primary_classification?.trim()
          return contractorCity === targetCityUpper && contractorClassification === targetClassification
        })
        
        console.log(`Found ${data.contractors.length} total contractors from API`)
        console.log(`Filtered to ${filteredContractors.length} contractors in ${cityName} with classification ${targetClassification}`)
        console.log(`Sample cities from results:`, data.contractors.slice(0, 10).map(c => c.city))
        console.log(`Sample classifications from results:`, data.contractors.slice(0, 10).map(c => c.primary_classification))
        
        setContractors(filteredContractors)
        
        // Calculate stats
        const activeContractors = filteredContractors.filter(c => 
          c.primary_status === 'CLEAR' || c.primary_status === 'ACTIVE' || c.primary_status === null
        )
        
        setStats({
          total: filteredContractors.length,
          active: activeContractors.length,
          city: cityName,
          classification: classification.toUpperCase()
        })
      } else {
        setContractors([])
        setStats({
          total: 0,
          active: 0,
          city: decodeURIComponent(city).replace(/-/g, ' '),
          classification: classification.toUpperCase()
        })
      }
    } catch (error) {
      console.error('Error fetching city contractors by type:', error)
      setContractors([])
      setStats({
        total: 0,
        active: 0,
        city: decodeURIComponent(city).replace(/-/g, ' '),
        classification: classification.toUpperCase()
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading contractor data...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>
          <div>Error loading contractor data</div>
          <Link href="/contractors/california" style={{ color: '#ffeb3b', textDecoration: 'underline', fontSize: '1.2rem', marginTop: '1rem', display: 'block' }}>
            ← Browse California Contractors
          </Link>
        </div>
      </div>
    )
  }

  const typeInfo = getContractorTypeInfo(classification)
  const cityDisplayName = stats.city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'California Contractors', href: '/contractors/california' },
    { label: `${cityDisplayName} Contractors`, href: `/contractors/california/${city}` },
    { label: `${stats.classification} Contractors` }
  ]

  const pageTitle = `${typeInfo.name} in ${cityDisplayName}, CA - ${stats.total} Licensed Contractors`
  const metaDescription = `Find ${stats.active} active ${typeInfo.name.toLowerCase()}s in ${cityDisplayName}, California. Licensed ${stats.classification} contractors with verified credentials and contact information.`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${cityDisplayName} ${typeInfo.name.toLowerCase()}, ${stats.classification} contractors ${cityDisplayName}, licensed ${typeInfo.name.toLowerCase()} ${cityDisplayName} CA`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://lookupcontractor.com/contractors/california/${city}/type/${classification}`} />
        <link rel="canonical" href={`https://lookupcontractor.com/contractors/california/${city}/type/${classification}`} />
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
            {typeInfo.name} in {cityDisplayName}, California
          </p>
        </header>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          
          <Breadcrumbs items={breadcrumbItems} />

          {/* Page Overview */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333', textAlign: 'center' }}>
              🔧 {typeInfo.name} in {cityDisplayName}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.5rem' }}>
                  {stats.total.toLocaleString()}
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem' }}>Total Licensed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0ea5e9', marginBottom: '0.5rem' }}>
                  {stats.active.toLocaleString()}
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem' }}>Active Licenses</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                  {stats.classification}
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem' }}>License Class</div>
              </div>
            </div>

            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.6, textAlign: 'center', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
              {stats.total > 0 
                ? `${cityDisplayName} has ${stats.total.toLocaleString()} licensed ${typeInfo.name.toLowerCase()}s. All contractor information is verified through the California State License Board (CSLB).`
                : `No ${typeInfo.name.toLowerCase()}s currently found in ${cityDisplayName}. Try browsing contractors statewide or check nearby cities.`
              }
            </p>

            {/* Navigation Options */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              marginTop: '1.5rem'
            }}>
              <Link href={`/contractors/california/${city}`} style={{
                background: '#059669',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🏙️ All {cityDisplayName} Contractors
              </Link>
              
              <Link href={`/contractor-types`} style={{
                background: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🔧 All {typeInfo.name}s Statewide
              </Link>
            </div>
          </div>

          {/* Contractors List */}
          {contractors.length > 0 && (
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
                👷 Licensed {typeInfo.name}s in {cityDisplayName}
              </h2>
              
              <div className="contractor-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {contractors.slice((currentPage - 1) * contractorsPerPage, currentPage * contractorsPerPage).map((contractor) => (
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
                      
                      {/* Business Name */}
                      <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#059669' }}>
                          {contractor.business_name}
                        </h3>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          License #{contractor.license_no}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div style={{ marginBottom: '1rem' }}>
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
                              letterSpacing: '0.3px',
                              display: 'inline-block'
                            }}>
                              {statusInfo.label}
                            </div>
                          )
                        })()}
                      </div>

                      {/* Contact & Location */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                        {/* Phone */}
                        {contractor.business_phone && (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.6rem',
                            padding: '0.6rem',
                            background: '#f8fafc',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div style={{ fontSize: '1rem' }}>📞</div>
                            <div>
                              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>Phone</div>
                              <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>
                                {contractor.business_phone}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Location */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.6rem',
                          padding: '0.6rem',
                          background: '#f8fafc',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{ fontSize: '1rem' }}>📍</div>
                          <div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>Location</div>
                            <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>
                              {contractor.city}, CA {contractor.zip_code}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {contractors.length > contractorsPerPage && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  marginTop: '2rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>
                    Showing {((currentPage - 1) * contractorsPerPage) + 1}-{Math.min(currentPage * contractorsPerPage, contractors.length)} of {contractors.length.toLocaleString()} {typeInfo.name.toLowerCase()}s in {cityDisplayName}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        ← Previous
                      </button>
                    )}
                    
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      Page {currentPage} of {Math.ceil(contractors.length / contractorsPerPage)}
                    </span>
                    
                    {currentPage < Math.ceil(contractors.length / contractorsPerPage) && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Next →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {contractors.length === 0 && (
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '3rem',
              textAlign: 'center',
              marginBottom: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#333' }}>
                No {typeInfo.name}s Found in {cityDisplayName}
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
                We couldn't find any {typeInfo.name.toLowerCase()}s currently licensed in {cityDisplayName}.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href={`/contractors/california/type/${classification}`} style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}>
                  View All {typeInfo.name}s Statewide
                </Link>
                <Link href={`/contractors/california/${city}`} style={{
                  background: '#059669',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}>
                  View All {cityDisplayName} Contractors
                </Link>
              </div>
            </div>
          )}
        </div>
        
        <style jsx>{`
          @media (max-width: 375px) {
            :global(.contractor-grid) {
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
            }
          }
          
          @media (max-width: 480px) {
            :global(.contractor-grid) {
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
              gap: 1rem !important;
            }
          }
        `}</style>
      </div>
    </>
  )
}