import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { createContractorUrl } from '../../../utils/slugify'

export default function CityContractors() {
  const router = useRouter()
  const { city } = router.query
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (city) {
      fetchCityStats()
    }
  }, [city])

  const fetchCityStats = async () => {
    try {
      const response = await fetch(`/api/city-stats?state=california&city=${city}`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching city stats:', error)
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

  if (!stats || stats.totalContractors === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>
          <div>No contractors found in {city?.replace(/-/g, ' ')}</div>
          <Link href="/contractors/california" style={{ color: '#ffeb3b', textDecoration: 'underline', fontSize: '1.2rem', marginTop: '1rem', display: 'block' }}>
            ← Browse California Contractors
          </Link>
        </div>
      </div>
    )
  }

  const cityDisplayName = stats.city.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'California Contractors', href: '/contractors/california' },
    { label: `${cityDisplayName} Contractors` }
  ]

  const pageTitle = `Licensed Contractors in ${cityDisplayName}, CA - ${stats.totalContractors.toLocaleString()} Verified Professionals`
  const metaDescription = `Find ${stats.activeContractors.toLocaleString()} active licensed contractors in ${cityDisplayName}, California. Compare licenses, contact info, specialties & ratings. Hire verified professionals.`

  const citySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Licensed Contractors in ${cityDisplayName}, California`,
    "description": metaDescription,
    "url": `https://lookupcontractor.com/contractors/california/${city}`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://lookupcontractor.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "California Contractors",
          "item": "https://lookupcontractor.com/contractors/california"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${cityDisplayName} Contractors`
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": `Licensed Contractors in ${cityDisplayName}`,
      "numberOfItems": stats.totalContractors
    }
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${cityDisplayName} contractors, licensed contractors ${cityDisplayName}, ${cityDisplayName} CA contractors, contractor lookup ${cityDisplayName}, ${cityDisplayName} license verification`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://lookupcontractor.com/contractors/california/${city}`} />
        <link rel="canonical" href={`https://lookupcontractor.com/contractors/california/${city}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }}
        />
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
            {cityDisplayName}, California Licensed Contractors
          </p>
        </header>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          
          <Breadcrumbs items={breadcrumbItems} />

          {/* City Overview */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333', textAlign: 'center' }}>
              🏙️ Licensed Contractors in {cityDisplayName}
            </h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', color: '#3b82f6', fontWeight: 'bold' }}>
                  {stats.totalContractors.toLocaleString()}
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  Total Licensed Contractors
                </div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', color: '#059669', fontWeight: 'bold' }}>
                  {stats.activeContractors.toLocaleString()}
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  Active License Status
                </div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fef3c7', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', color: '#d97706', fontWeight: 'bold' }}>
                  {stats.contractorTypes?.length || 0}
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  Contractor Types
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#555', lineHeight: 1.6 }}>
              <p>
                {cityDisplayName} is home to <strong>{stats.totalContractors.toLocaleString()} licensed contractors</strong> across 
                multiple specialties and trade classifications. Find qualified professionals for your construction, 
                renovation, or repair projects.
              </p>
              <p style={{ marginTop: '1rem' }}>
                All contractor information is verified through the California State License Board (CSLB) to ensure 
                you're working with legitimate, licensed professionals.
              </p>
            </div>
          </div>

          {/* Contractor Types */}
          {stats.contractorTypes && stats.contractorTypes.length > 0 && (
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem', 
              marginBottom: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
                🔧 Popular Contractor Types in {cityDisplayName}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {stats.contractorTypes.map((type) => (
                  <div key={type.primary_classification} style={{ 
                    padding: '1.5rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    transition: 'all 0.2s',
                    cursor: 'pointer'
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {type.primary_classification}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.95rem' }}>
                          {type.trade}
                        </div>
                      </div>
                      <div style={{ 
                        background: '#e0f2fe',
                        color: '#0369a1',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {parseInt(type.contractor_count).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Contractors */}
          {stats.sampleContractors && stats.sampleContractors.length > 0 && (
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem', 
              marginBottom: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
                👷 Featured Contractors in {cityDisplayName}
              </h2>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {stats.sampleContractors.slice(0, 10).map((contractor) => (
                  <div key={contractor.license_no} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>
                          <Link href={createContractorUrl(contractor.license_no, contractor.business_name)} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                            {contractor.business_name}
                          </Link>
                        </h3>
                        <div style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem' }}>
                          License: <strong>{contractor.license_no}</strong>
                        </div>
                        <div style={{ color: '#666', fontSize: '0.95rem' }}>
                          {contractor.primary_classification} - {contractor.trade}
                        </div>
                        {contractor.business_phone && (
                          <div style={{ color: '#666', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                            📞 {contractor.business_phone}
                          </div>
                        )}
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        backgroundColor: '#059669' + '20',
                        color: '#059669',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        Active
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link href={`/?search=${cityDisplayName}%20contractors`} style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  display: 'inline-block'
                }}>
                  View All {stats.totalContractors.toLocaleString()} Contractors
                </Link>
              </div>
            </div>
          )}

          {/* ZIP Codes */}
          {stats.zipCodes && stats.zipCodes.length > 0 && (
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem', 
              marginBottom: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
                📍 Service Areas in {cityDisplayName}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {stats.zipCodes.map((zip) => (
                  <div key={zip.zip_code} style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
                      {zip.zip_code}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                      {parseInt(zip.contractor_count).toLocaleString()} contractors
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
            Lookup Contractor - Licensed contractors in {cityDisplayName}, California
          </p>
        </footer>
      </div>
    </>
  )
}