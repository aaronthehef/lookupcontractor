import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Breadcrumbs from '../../components/Breadcrumbs'
import { createSlug } from '../../utils/slugify'
import { contractorTypeDetails } from '../../utils/contractorTypes'
import { useRouter } from 'next/router'

export default function CaliforniaContractors() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contractorTypes, setContractorTypes] = useState([])
  const router = useRouter()

  const handleContractorTypeChange = (event) => {
    const selectedType = event.target.value
    if (selectedType) {
      router.push(`/contractor-types#${selectedType}`)
    }
  }

  useEffect(() => {
    fetchStateStats()
  }, [])

  const fetchStateStats = async () => {
    try {
      const response = await fetch('/api/state-stats?state=california')
      const data = await response.json()
      setStats(data)
      // Use contractor types from state stats
      if (data.topTypes) {
        console.log('Setting contractor types:', data.topTypes.length, 'types')
        console.log('First few types:', data.topTypes.slice(0, 3))
        setContractorTypes(data.topTypes)
      } else {
        console.log('No topTypes found in API response')
      }
    } catch (error) {
      console.error('Error fetching state stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'California Contractors' }
  ]

  const pageTitle = `Licensed Contractors in California - ${stats?.totalContractors?.toLocaleString() || '240,000+'} Verified Professionals`
  const metaDescription = `Find ${stats?.activeContractors?.toLocaleString() || '200,000+'} active licensed contractors in California. Search by city, license type, or business name. Verify licenses, contact info & credentials.`

  const stateSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Licensed Contractors in California",
    "description": metaDescription,
    "url": "https://lookupcontractor.com/contractors/california",
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
          "name": "California Contractors"
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "California Cities with Licensed Contractors",
      "numberOfItems": stats?.topCities?.length || 20
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading California contractor data...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="California contractors, licensed contractors California, contractor lookup CA, California license verification, find contractors California" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lookupcontractor.com/contractors/california" />
        <link rel="canonical" href="https://lookupcontractor.com/contractors/california" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(stateSchema) }}
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
            California Licensed Contractors
          </p>
        </header>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          
          <Breadcrumbs items={breadcrumbItems} />

          {/* State Overview */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333', textAlign: 'center' }}>
              🏛️ Licensed Contractors in California
            </h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', color: '#3b82f6', fontWeight: 'bold' }}>
                  {stats?.totalContractors?.toLocaleString() || '240,671'}
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  Total Licensed Contractors
                </div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', color: '#059669', fontWeight: 'bold' }}>
                  {stats?.activeContractors?.toLocaleString() || '198,523'}
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  Active License Status
                </div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fef3c7', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', color: '#d97706', fontWeight: 'bold' }}>
                  {stats?.topCities?.length || 20}+
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  Cities Covered
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#555', lineHeight: 1.6 }}>
              <p>
                California maintains one of the most comprehensive contractor licensing systems in the United States. 
                The California State License Board (CSLB) regulates over <strong>{stats?.totalContractors?.toLocaleString() || '240,000'} licensed contractors</strong> across 
                dozens of specialized trades and classifications.
              </p>
              <p style={{ marginTop: '1rem' }}>
                Find verified contractors in your area, check license status, view contact information, and ensure 
                you're hiring qualified professionals for your project.
              </p>
            </div>

            {/* Navigation Options */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              marginTop: '2rem'
            }}>
              <Link href="/contractor-types" style={{
                background: '#3b82f6',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.1rem'
              }}>
                🔧 Browse by Contractor Type
              </Link>
              
              <Link href="/" style={{
                background: '#059669',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.1rem'
              }}>
                🔍 Search All Contractors
              </Link>
            </div>
          </div>

          {/* Contractor Type Selector */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#333', textAlign: 'center' }}>
              🔍 Find Contractors by Specialty
            </h2>
            
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <label htmlFor="contractor-type-select" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                Select Contractor Type:
              </label>
              <select 
                id="contractor-type-select"
                onChange={handleContractorTypeChange}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="">Choose a contractor specialty...</option>
                {contractorTypes.map((type, index) => {
                  // Get icon and friendly name from predefined list if available
                  const typeInfo = contractorTypeDetails[type.primary_classification?.toLowerCase()]
                  const displayName = typeInfo?.name || type.trade || type.primary_classification
                  const icon = typeInfo?.icon || '🔧'
                  const contractorCount = parseInt(type.contractor_count || 0)
                  
                  console.log(`Contractor type ${index}:`, type) // Debug log
                  
                  return (
                    <option key={`${type.primary_classification}-${index}`} value={type.primary_classification?.toLowerCase()}>
                      {icon} {displayName} ({type.primary_classification}) - {contractorCount.toLocaleString()} contractors
                    </option>
                  )
                })}
              </select>
              
              <p style={{ 
                marginTop: '0.75rem', 
                fontSize: '0.9rem', 
                color: '#6b7280', 
                textAlign: 'center' 
              }}>
                Select a contractor type to learn more and find licensed professionals in that specialty
              </p>
            </div>
          </div>

          {/* Top Cities */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
              🌆 Top Cities for Licensed Contractors
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {stats?.topCities?.slice(0, 12).map((city, index) => (
                <Link key={city.city} href={`/contractors/california/${createSlug(city.city)}`}>
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
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                          {city.city}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.95rem' }}>
                          {parseInt(city.contractor_count).toLocaleString()} licensed contractors
                        </div>
                      </div>
                      <div style={{ 
                        background: index < 3 ? '#fef3c7' : '#f3f4f6',
                        color: index < 3 ? '#d97706' : '#6b7280',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Contractor Types */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
              🔧 Most Common Contractor Types
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {stats?.topTypes?.slice(0, 9).map((type) => (
                <Link key={type.primary_classification} href={`/contractors/california/type/${type.primary_classification.toLowerCase()}`}>
                  <div style={{ 
                    padding: '1.5rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    color: '#333'
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
                </Link>
              ))}
            </div>
          </div>

          {/* Search CTA */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '3rem 2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
              🔍 Find the Right Contractor for Your Project
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
              Search our comprehensive database of California licensed contractors. 
              Verify licenses, check credentials, and find trusted professionals in your area.
            </p>
            <Link href="/" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'inline-block',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}>
              🚀 Start Your Search
            </Link>
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
            Lookup Contractor - Your trusted source for California licensed contractor information
          </p>
        </footer>
      </div>
    </>
  )
}