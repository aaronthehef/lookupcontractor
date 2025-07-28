import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getStatusInfo } from '../../utils/statusHelper'

export default function ContractorProfile() {
  const router = useRouter()
  const { license } = router.query
  const [contractor, setContractor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (license) {
      fetchContractor()
    }
  }, [license])

  const fetchContractor = async () => {
    try {
      const response = await fetch('/api/contractor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ license }),
      })

      if (!response.ok) {
        throw new Error('Contractor not found')
      }

      const data = await response.json()
      setContractor(data.contractor)
    } catch (err) {
      setError('Contractor not found')
      console.error('Error fetching contractor:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatPhone = (phone) => {
    if (!phone) return 'N/A'
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`
    }
    return phone
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

  if (error || !contractor) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
        <h1>Contractor Not Found</h1>
        <p>The contractor license number "{license}" was not found in our database.</p>
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
            ← Back to Search
          </Link>
          <h1 style={{ fontSize: '2.5rem', margin: '1rem 0 0.5rem 0' }}>
            {contractor.business_name}
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
            License #{contractor.license_no} • {contractor.city}, {contractor.state}
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Main Info Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Business Information */}
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                Business Information
              </h2>
              
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
                  {formatPhone(contractor.business_phone)}
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
                  {formatDate(contractor.issue_date)}
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Expiration Date:</strong><br />
                  {formatDate(contractor.expiration_date)}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Address Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
            Address & Location
          </h2>
          
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
                All Classifications & Industries
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {classifications.map((classification, index) => (
                  <div key={index} style={{ 
                    background: '#f8fafc', 
                    padding: '0.75rem', 
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.95rem'
                  }}>
                    {classification}
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
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
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

      </div>
    </div>
  )
}