import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import { createContractorUrl } from '../../../../utils/slugify'
import { getContractorTypeInfo } from '../../../../utils/contractorTypes'

export default function ContractorTypeCaliforniaPage() {
  const router = useRouter()
  const { classification } = router.query
  const [contractors, setContractors] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (classification) {
      fetchContractorsByType()
    }
  }, [classification])

  const fetchContractorsByType = async () => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: classification.toUpperCase(),
          searchType: 'classification',
          state: 'california'
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setContractors(data.contractors || [])
        
        // Calculate stats (include CLEAR, ACTIVE, and NULL statuses like main search)
        const activeContractors = data.contractors?.filter(c => 
          c.primary_status === 'CLEAR' || c.primary_status === 'ACTIVE' || c.primary_status === null
        ) || []
        const cities = [...new Set(data.contractors?.map(c => c.city).filter(Boolean))] || []
        
        setStats({
          total: data.contractors?.length || 0,
          active: activeContractors.length,
          cities: cities.length,
          topCities: cities.slice(0, 10)
        })
      }
    } catch (error) {
      console.error('Error fetching contractors:', error)
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

  if (!contractors.length) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>
          <div>No {classification?.toUpperCase()} contractors found</div>
          <Link href="/contractors/california" style={{ color: '#ffeb3b', textDecoration: 'underline', fontSize: '1.2rem', marginTop: '1rem', display: 'block' }}>
            ← Browse All California Contractors
          </Link>
        </div>
      </div>
    )
  }

  const typeInfo = getContractorTypeInfo(classification)
  const classificationUpper = classification?.toUpperCase()

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'California Contractors', href: '/contractors/california' },
    { label: `${classificationUpper} Contractors` }
  ]

  const pageTitle = `${typeInfo.name} (${classificationUpper}) in California - ${stats?.total?.toLocaleString() || '0'} Licensed Contractors`
  const metaDescription = `Find ${stats?.active?.toLocaleString() || '0'} active ${typeInfo.name.toLowerCase()}s in California. Licensed ${classificationUpper} contractors with verified credentials, contact info & project details.`

  const typeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${typeInfo.name} in California`,
    "description": metaDescription,
    "url": `https://lookupcontractor.com/contractors/california/type/${classification}`,
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
          "name": `${classificationUpper} Contractors`
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "@id": `https://lookupcontractor.com/contractors/california/type/${classification}#contractors`,
      "name": `${typeInfo.name} in California`,
      "numberOfItems": stats?.total || 0
    }
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${typeInfo.keywords}, California ${classificationUpper} contractors, licensed ${typeInfo.name.toLowerCase()}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://lookupcontractor.com/contractors/california/type/${classification}`} />
        <link rel="canonical" href={`https://lookupcontractor.com/contractors/california/type/${classification}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(typeSchema) }}
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
            {typeInfo.name} in California
          </p>
        </header>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          
          <Breadcrumbs items={breadcrumbItems} />

          {/* Type Overview */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {typeInfo.icon}
              </div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
                {typeInfo.name} ({classificationUpper})
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
                {typeInfo.description}
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', color: '#3b82f6', fontWeight: 'bold' }}>
                  {stats?.total?.toLocaleString() || '0'}
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  Total Licensed
                </div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', color: '#059669', fontWeight: 'bold' }}>
                  {stats?.active?.toLocaleString() || '0'}
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  Active Licenses
                </div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fef3c7', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', color: '#d97706', fontWeight: 'bold' }}>
                  {stats?.cities || 0}+
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  Cities Served
                </div>
              </div>
            </div>
          </div>

          {/* Common Projects */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
              🛠️ Common {typeInfo.name} Projects
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {typeInfo.commonProjects.map((project, index) => (
                <div key={index} style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  textAlign: 'center',
                  transition: 'all 0.2s'
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
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: '#333' }}>
                    {project}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Bond Requirement</div>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{typeInfo.requiredBond}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Typical Project Size</div>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{typeInfo.averageProjectSize}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Contractors */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
              👷 Featured {typeInfo.name}s in California
            </h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {contractors.slice(0, 15).map((contractor) => (
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
                          {contractor.business_name || 'Unnamed Business'}
                        </Link>
                      </h3>
                      <div style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem' }}>
                        License: <strong>{contractor.license_no}</strong>
                      </div>
                      <div style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        📍 {contractor.city}, CA {contractor.zip_code}
                      </div>
                      {contractor.business_phone && (
                        <div style={{ color: '#666', fontSize: '0.95rem' }}>
                          📞 {contractor.business_phone}
                        </div>
                      )}
                    </div>
                    <div style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      backgroundColor: contractor.primary_status === 'CLEAR' ? '#059669' + '20' : '#dc2626' + '20',
                      color: contractor.primary_status === 'CLEAR' ? '#059669' : '#dc2626',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      {contractor.primary_status === 'CLEAR' ? 'Active' : contractor.primary_status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href={`/?search=${classificationUpper}%20contractors%20california`} style={{
                background: '#3b82f6',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                Search All {stats?.total?.toLocaleString() || '0'} {classificationUpper} Contractors
              </Link>
            </div>
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
            Lookup Contractor - Licensed {typeInfo.name}s in California
          </p>
        </footer>
      </div>
    </>
  )
}