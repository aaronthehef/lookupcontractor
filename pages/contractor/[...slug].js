import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { getStatusInfo } from '../../utils/statusHelper'
import { getContractorTypeInfo } from '../../utils/contractorTypes'
import { parseContractorUrl } from '../../utils/urlHelpers'
import { sanitizeContractor, formatDate, formatCurrency, formatPhone, safeString } from '../../utils/dataHelpers'
import Breadcrumbs from '../../components/Breadcrumbs'
import ErrorBoundary from '../../components/ErrorBoundary'

// Dynamically import map component to avoid SSR issues
const ContractorMap = dynamic(() => import('../../components/ContractorMap'), {
  ssr: false,
  loading: () => <div style={{ height: '300px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>
})

export default function ContractorUniversalProfile({ contractor: initialContractor, error: initialError }) {
  const router = useRouter()
  const { slug = [] } = router.query
  const [contractor, setContractor] = useState(initialContractor)
  const [loading, setLoading] = useState(!initialContractor)
  const [error, setError] = useState(initialError || '')
  
  // Determine URL type and params from slug
  const urlType = slug.length === 3 ? 'seo' : 'old'
  const urlParams = urlType === 'seo' && slug.length === 3 ? {
    city: slug[0],
    trade: slug[1], 
    licenseAndName: slug[2]
  } : {}

  useEffect(() => {
    // Only run client-side parsing if we don't have initial data
    if (!initialContractor && slug.length > 0) {
      parseUrl()
    }
  }, [slug, initialContractor])

  const parseUrl = () => {
    console.log('URL slug array:', slug)
    
    if (slug.length === 1) {
      // Old format: /contractor/996518 - check if it's a pure license number
      const licenseCandidate = slug[0]
      console.log('Single slug, license candidate:', licenseCandidate)
      // If it looks like a license (letters, numbers, dashes, spaces), treat as license
      if (/^[A-Z0-9\-\s]+$/i.test(licenseCandidate) && licenseCandidate.length >= 3) {
        fetchContractor(licenseCandidate)
      } else {
        setError('Invalid URL format')
        setLoading(false)
      }
    } else if (slug.length === 3) {
      // New SEO format: /contractor/los-angeles/plumber/996518-johns-plumbing
      console.log('Three slugs detected:', slug)
      const [city, trade, licenseAndName] = slug
      console.log('Parsed parts:', { city, trade, licenseAndName })
      const parsedUrl = parseContractorUrl(city, trade, licenseAndName)
      console.log('Parsed URL result:', parsedUrl)
      if (parsedUrl && parsedUrl.license) {
        fetchContractor(parsedUrl.license)
      } else {
        console.error('Failed to parse URL')
        setError('Invalid URL format')
        setLoading(false)
      }
    } else {
      setError('Invalid URL format')
      setLoading(false)
    }
  }

  const fetchContractor = async (license) => {
    console.log('🔥 fetchContractor called with license:', license)
    try {
      console.log('🔥 Making API call to /api/contractor')
      const response = await fetch('/api/contractor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ license }),
      })

      console.log('🔥 API response status:', response.status)
      if (!response.ok) {
        throw new Error('Contractor not found')
      }

      const data = await response.json()
      console.log('🔥 API response data:', data)
      const sanitizedContractor = sanitizeContractor(data.contractor)
      console.log('🔥 Sanitized contractor:', sanitizedContractor)
      setContractor(sanitizedContractor)
      setError('') // Clear any previous errors
    } catch (err) {
      console.error('🔥 Error fetching contractor:', err)
      setError('Contractor not found')
    } finally {
      setLoading(false)
    }
  }



  const parseClassifications = (rawClassifications) => {
    if (!rawClassifications) return []
    return rawClassifications.split(/[|,;]+/).map(c => c.trim()).filter(Boolean)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
        <div>Loading contractor information...</div>
      </div>
    )
  }

  console.log('🔥 Render check - error:', error, 'contractor:', !!contractor, 'loading:', loading)
  
  if (error || !contractor) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
        <h1>Contractor Not Found</h1>
        <p>The contractor information was not found in our database.</p>
        <Link href="/">
          <button style={{ 
            background: '#3b82f6', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Back to Search
          </button>
        </Link>
      </div>
    )
  }

  const classifications = parseClassifications(contractor.raw_classifications)

  // Generate SEO-friendly content based on URL type
  const pageTitle = urlType === 'seo' 
    ? `${contractor.business_name} - ${urlParams.trade} in ${urlParams.city} - Licensed Contractor #${contractor.license_no}`
    : `${contractor.business_name} - Licensed Contractor #${contractor.license_no} - ${contractor.city}, CA`
    
  const metaDescription = urlType === 'seo'
    ? `Licensed ${urlParams.trade} in ${urlParams.city}, CA. ${contractor.business_name} - License #${contractor.license_no}, ${contractor.primary_status === 'CLEAR' ? 'active license' : 'license status: ' + contractor.primary_status}. ${contractor.business_phone ? 'Phone: ' + formatPhone(contractor.business_phone) + '.' : ''} View license details, bond information & get directions.`
    : `Licensed ${contractor.trade || 'contractor'} in ${contractor.city || 'California'}, CA. License #${contractor.license_no}, ${contractor.primary_status === 'CLEAR' ? 'active license' : 'license status: ' + contractor.primary_status}. ${contractor.business_phone ? 'Phone: ' + formatPhone(contractor.business_phone) + '.' : ''} View license details, bond information & get directions.`
  
  // Generate breadcrumbs with proper URL formatting
  const citySlug = contractor.city?.toLowerCase().replace(/\s+/g, '-') || 'unknown'
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'California Contractors', href: '/contractors/california' },
    ...(contractor.city ? [{ label: `${contractor.city} Contractors`, href: `/contractors/california/${citySlug}` }] : []),
    ...(contractor.primary_classification ? [{ label: `${contractor.primary_classification} Contractors`, href: `/contractors/california/type/${contractor.primary_classification.toLowerCase()}` }] : []),
    { label: contractor.business_name }
  ]
  
  const canonicalUrl = urlType === 'seo' 
    ? `https://lookupcontractor.com/contractor/${urlParams.city}/${urlParams.trade}/${urlParams.licenseAndName}`
    : `https://lookupcontractor.com/contractor/${contractor.license_no}`
  
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": contractor.business_name,
    "description": urlType === 'seo' 
      ? `Licensed ${urlParams.trade} serving ${urlParams.city}, California`
      : `Licensed ${contractor.trade || 'contractor'} serving ${contractor.city}, California`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": contractor.mailing_address,
      "addressLocality": contractor.city,
      "addressRegion": "CA",
      "postalCode": contractor.zip_code,
      "addressCountry": "US"
    },
    "telephone": contractor.business_phone,
    "url": canonicalUrl,
    "priceRange": "$$",
    "serviceArea": {
      "@type": "City",
      "name": contractor.city,
      "addressRegion": "CA"
    },
    "license": {
      "@type": "GovernmentPermit",
      "identifier": contractor.license_no,
      "issuedBy": "California State License Board",
      "validThrough": contractor.expiration_date
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "License Classification",
        "value": contractor.primary_classification
      },
      {
        "@type": "PropertyValue", 
        "name": "Trade Specialty",
        "value": contractor.trade
      }
    ]
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${contractor.trade}, ${contractor.city}, California, licensed contractor, ${contractor.primary_classification}, ${contractor.business_name}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="business.business" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </Head>
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '2rem 0' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>
            ← Back to Search
          </Link>
          <h1 style={{ fontSize: '2.5rem', margin: '1rem 0 0.5rem 0' }}>
            {contractor.business_name}
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
            {urlType === 'seo' 
              ? `${urlParams.trade} in ${urlParams.city} • License #${contractor.license_no}`
              : `License #${contractor.license_no} • ${contractor.city}, ${contractor.state}`
            }
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
        
        {/* Main Info Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            {/* Business Information */}
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                Business Information
              </h2>
              
              {/* Verified Badge */}
              {contractor.phone_verified && (
                <div style={{ 
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
                }}>
                  <span style={{ fontSize: '1.1rem' }}>✅</span>
                  Verified Business
                </div>
              )}
              
              <div style={{ lineHeight: 1.8, color: '#555' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Business Name:</strong><br />
                  {contractor.business_name}
                </div>
                
                {contractor.full_business_name && contractor.full_business_name !== contractor.business_name && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong>Full Business Name:</strong><br />
                    {contractor.full_business_name}
                  </div>
                )}
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Business Type:</strong><br />
                  {contractor.business_type || 'N/A'}
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Phone:</strong><br />
                  <span suppressHydrationWarning>
                    {formatPhone(contractor.business_phone)}
                  </span>
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Website:</strong><br />
                  {contractor.website ? (
                    <a 
                      href={contractor.website.startsWith('http') ? contractor.website : `https://${contractor.website}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6', textDecoration: 'none' }}
                      onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                    >
                      {contractor.website}
                    </a>
                  ) : (
                    <Link href="/contractor/register" style={{ 
                      color: '#dc2626', 
                      textDecoration: 'none',
                      fontStyle: 'italic',
                      fontSize: '0.95rem'
                    }}>
                      📢 Claim your business page to add your website
                    </Link>
                  )}
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Description:</strong><br />
                  {contractor.description ? (
                    <div style={{ 
                      marginTop: '0.5rem', 
                      padding: '1rem', 
                      background: '#f8fafc', 
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      lineHeight: '1.6'
                    }}>
                      {contractor.description}
                    </div>
                  ) : (
                    <div style={{ 
                      marginTop: '0.5rem', 
                      padding: '1rem', 
                      background: '#fef2f2', 
                      borderRadius: '6px',
                      border: '1px solid #fecaca',
                      lineHeight: '1.6'
                    }}>
                      <Link href="/contractor/register" style={{ 
                        color: '#dc2626', 
                        textDecoration: 'none',
                        fontStyle: 'italic'
                      }}>
                        🚀 Claim this business page to add your description and stand out from competitors
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* License Information */}
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                License Information
              </h2>
              
              <div style={{ lineHeight: 1.8, color: '#555' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>License Number:</strong><br />
                  {contractor.license_no}
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>License Status:</strong><br />
                  {(() => {
                    const statusInfo = getStatusInfo(contractor.primary_status)
                    return (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{
                          background: statusInfo.bgColor,
                          color: statusInfo.color,
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <span>{statusInfo.icon}</span>
                          <span>{statusInfo.label}</span>
                        </div>
                        <div style={{ 
                          fontSize: '0.9rem', 
                          color: '#666', 
                          fontStyle: 'italic',
                          lineHeight: 1.4
                        }}>
                          {statusInfo.description}
                        </div>
                      </div>
                    )
                  })()}
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Issue Date:</strong><br />
                  <span suppressHydrationWarning>
                    {formatDate(contractor.issue_date)}
                  </span>
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Expiration Date:</strong><br />
                  <span suppressHydrationWarning>
                    {formatDate(contractor.expiration_date)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Address & Map Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
            📍 Address & Location
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {/* Address Information */}
            <div style={{ lineHeight: 1.8, color: '#555' }}>
              {contractor.mailing_address && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Mailing Address:</strong><br />
                  {contractor.mailing_address}
                </div>
              )}
              
              <div style={{ marginBottom: '0.75rem' }}>
                <strong>City:</strong> {contractor.city}<br />
                <strong>County:</strong> {contractor.county || 'N/A'}<br />
                <strong>State:</strong> {contractor.state}<br />
                <strong>ZIP Code:</strong> {contractor.zip_code || 'N/A'}
              </div>

              {contractor.business_phone && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Phone:</strong><br />
                  <a href={`tel:${contractor.business_phone}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                    <span suppressHydrationWarning>
                      📞 {formatPhone(contractor.business_phone)}
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* Interactive Map */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>
                🗺️ Location Map
              </h3>
              <ContractorMap contractor={contractor} />
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
                Click the marker for directions
              </div>
            </div>
          </div>
        </div>

        {/* Classifications Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
            Contractor Classifications
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              background: '#3b82f6', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Primary Classification</h3>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                {contractor.primary_classification} - {contractor.trade || 'General Contractor'}
              </div>
            </div>
          </div>

          {classifications.length > 1 && (
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>
                Additional Classifications & Industries
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {classifications
                  .filter(classification => classification !== contractor.primary_classification)
                  .map((classification, index) => (
                  <div key={index} style={{ 
                    background: '#f8fafc', 
                    padding: '0.75rem', 
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.95rem'
                  }}>
                    {(() => {
                      const typeInfo = getContractorTypeInfo(classification)
                      return `${classification} - ${typeInfo.name}`
                    })()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Financial Information */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
            Insurance & Bonding
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#333' }}>Workers' Compensation</h3>
              <div style={{ lineHeight: 1.6, color: '#555' }}>
                <div><strong>Coverage Type:</strong> {contractor.workers_comp_coverage_type || 'N/A'}</div>
                {contractor.wc_insurance_company && (
                  <div><strong>Insurance Company:</strong> {contractor.wc_insurance_company}</div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#333' }}>Contractor Bond</h3>
              <div style={{ lineHeight: 1.6, color: '#555' }}>
                {contractor.cb_amount && (
                  <div><strong>Bond Amount:</strong> ${parseInt(contractor.cb_amount).toLocaleString()}</div>
                )}
                {contractor.cb_surety_company && (
                  <div><strong>Surety Company:</strong> {contractor.cb_surety_company}</div>
                )}
                {!contractor.cb_amount && !contractor.cb_surety_company && (
                  <div>Bond information not available</div>
                )}
              </div>
            </div>

          </div>
        </div>


        {/* Related Contractors */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
            🔗 Related Contractors & Services
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {contractor.city && (
              <Link href={`/contractors/california/${contractor.city.toLowerCase().replace(/\s+/g, '-')}`} style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
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
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                More {contractor.city} Contractors
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                View all licensed contractors in {contractor.city}
              </div>
            </Link>
            )}

            {contractor.primary_classification && (
              <Link href={`/contractors/california/type/${contractor.primary_classification.toLowerCase()}`} style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
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
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                More {contractor.trade} Contractors
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                View all {contractor.primary_classification} contractors
              </div>
            </Link>
            )}

            {contractor.trade && contractor.city && (
              <Link href={`/?search=${contractor.trade} in ${contractor.city}`} style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
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
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Search {contractor.trade} in {contractor.city}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                Find similar contractors nearby
              </div>
            </Link>
            )}

            <Link href="/contractors/california" style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
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
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Browse All California Contractors
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                240,000+ licensed professionals
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
    
    <style jsx>{`
      @media (max-width: 375px) {
        :global(.leaflet-container) {
          max-width: 100% !important;
          overflow: hidden !important;
        }
      }
    `}</style>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { executeQuery } = await import('../../lib/database')
  const { slug = [] } = params

  try {
    let license = null

    // Parse URL to extract license number
    if (slug.length === 1) {
      // Old format: /contractor/996518
      const licenseCandidate = slug[0]
      if (/^\d+/.test(licenseCandidate)) {
        license = licenseCandidate
      }
    } else if (slug.length === 3) {
      // New SEO format: /contractor/los-angeles/plumber/996518-johns-plumbing
      const [city, trade, licenseAndName] = slug
      const parsedUrl = parseContractorUrl(city, trade, licenseAndName)
      if (parsedUrl && parsedUrl.license) {
        license = parsedUrl.license
      }
    }

    if (!license) {
      return {
        props: {
          contractor: null,
          error: 'Invalid URL format'
        }
      }
    }

    // Fetch contractor from database
    const result = await executeQuery(
      'SELECT * FROM contractors WHERE license_no = $1',
      [license]
    )

    if (!result || result.rows.length === 0) {
      return {
        props: {
          contractor: null,
          error: 'Contractor not found'
        }
      }
    }

    const contractor = result.rows[0]

    return {
      props: {
        contractor: JSON.parse(JSON.stringify(contractor)), // Serialize dates
        error: null
      }
    }
  } catch (error) {
    console.error('Error fetching contractor:', error)
    return {
      props: {
        contractor: null,
        error: 'Database error'
      }
    }
  }
}