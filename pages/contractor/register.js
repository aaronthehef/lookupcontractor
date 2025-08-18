import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function ContractorRegister() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    license_no: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          license_no: formData.license_no,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('contractor_token', data.token)
        setSuccess('Account created successfully! Redirecting to dashboard...')
        
        setTimeout(() => {
          router.push('/contractor/dashboard')
        }, 2000)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Register Your Contractor Account - LookupContractor</title>
        <meta name="description" content="Claim your contractor page and grow your business with LookupContractor" />
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
              ← Back to LookupContractor
            </Link>
            <h1 style={{ fontSize: '2.5rem', margin: '1rem 0 0.5rem 0' }}>
              Claim Your Contractor Page
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
              Get more leads and build credibility with a verified contractor account
            </p>
          </div>
        </header>

        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          
          {/* Benefits Section */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
              🚀 Why Register Your Business?
            </h2>
            <ul style={{ color: '#555', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
              <li><strong>FREE to start</strong> - Claim your page at no cost</li>
              <li><strong>Build credibility</strong> - Show customers you're legitimate</li>
              <li><strong>Get more leads</strong> - Higher search rankings</li>
              <li><strong>Professional profile</strong> - Add photos, description, website</li>
            </ul>
          </div>

          {/* Registration Form */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
              Create Your Account
            </h2>

            {error && (
              <div style={{ 
                background: '#fef2f2', 
                color: '#dc2626', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ 
                background: '#f0fdf4', 
                color: '#16a34a', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid #bbf7d0'
              }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  California License Number *
                </label>
                <input
                  type="text"
                  name="license_no"
                  value={formData.license_no}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 996518"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
                <small style={{ color: '#666', fontSize: '0.9rem' }}>
                  Must be a valid license in our database
                </small>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  autoComplete="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  placeholder="(555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
                <small style={{ color: '#666', fontSize: '0.9rem' }}>
                  Used for business verification
                </small>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Minimum 6 characters"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter your password"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  padding: '0.875rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Free Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
              Already have an account? {' '}
              <Link href="/contractor/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Sign in here
              </Link>
            </div>
          </div>

          {/* Pricing Preview */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            marginTop: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>
              💰 Choose Your Plan Later
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <strong style={{ color: '#059669' }}>FREE</strong><br />
                Basic page claim<br />
                Add website & description
              </div>
              <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <strong style={{ color: '#3b82f6' }}>$4.99/month</strong><br />
                ✅ Verified badge<br />
                Higher search ranking
              </div>
              <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <strong style={{ color: '#dc2626' }}>$19.99/month</strong><br />
                🌟 Featured badge<br />
                Top placement + photos
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem', marginBottom: 0 }}>
              Start free, upgrade anytime from your dashboard
            </p>
          </div>
        </div>
      </div>
    </>
  )
}