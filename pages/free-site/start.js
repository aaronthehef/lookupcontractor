import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function FreeSiteStart() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    business_name: '',
    license_number: '',
    contact_name: '',
    contact_email: '',
    phone_number: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contractor, setContractor] = useState(null)

  useEffect(() => {
    // Check if user is logged in as a contractor to prefill data
    const token = localStorage.getItem('contractor_token')
    if (token) {
      verifyTokenAndPrefill(token)
    }
  }, [])

  const verifyTokenAndPrefill = async (token) => {
    try {
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      const data = await response.json()
      if (response.ok && data.contractor) {
        setContractor(data.contractor)
        setFormData(prev => ({
          ...prev,
          business_name: data.contractor.business_name || '',
          license_number: data.contractor.license_no || '',
          contact_name: data.contractor.business_name || '', // Fallback to business name
          phone_number: data.contractor.phone_number || data.contractor.business_phone || ''
        }))
      }
    } catch (err) {
      console.log('Not logged in or token invalid')
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!formData.business_name || !formData.contact_email || !formData.phone_number) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.contact_email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/free-site-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contractor_id: contractor?.id || null,
          source: 'dashboard_cta'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        // Redirect to thank you page
        router.push('/free-site/thank-you')
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    }
    
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Get Your Free Contractor Website - Start Here</title>
        <meta name="description" content="Get started with your free contractor website. Just takes 2 minutes to fill out the form." />
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {/* Header */}
        <header style={{ 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
              LookupContractor
            </Link>
            <Link href="/free-site" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>
              ← Back
            </Link>
          </div>
        </header>

        {/* Form Section */}
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          padding: '3rem 2rem',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1rem', 
                color: '#333',
                fontWeight: 'bold'
              }}>
                Get Your Free Website
              </h1>
              <p style={{ 
                color: '#666', 
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}>
                Just takes 2 minutes. We'll have your demo ready in 24 hours.
              </p>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 'bold', 
                  color: '#333' 
                }}>
                  Business Name *
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  required
                  placeholder="ABC Plumbing Inc."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 'bold', 
                  color: '#333' 
                }}>
                  License Number
                </label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleInputChange}
                  placeholder="C-36, 12345, etc."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <small style={{ color: '#666', fontSize: '0.9rem' }}>
                  Optional - helps us customize your website
                </small>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 'bold', 
                  color: '#333' 
                }}>
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Smith"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 'bold', 
                  color: '#333' 
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@abcplumbing.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 'bold', 
                  color: '#333' 
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  placeholder="(555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#9ca3af' : '#f59e0b',
                  color: 'white',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  marginTop: '1rem'
                }}
                onMouseOver={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#d97706'
                }}
                onMouseOut={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#f59e0b'
                }}
              >
                {loading ? 'Creating Your Website...' : 'Get My Free Website →'}
              </button>
            </form>

            <div style={{ 
              marginTop: '2rem', 
              textAlign: 'center', 
              fontSize: '0.9rem', 
              color: '#666' 
            }}>
              🔒 Your information is secure and will never be shared
            </div>
          </div>
        </div>
      </div>
    </>
  )
}