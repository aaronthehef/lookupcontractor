import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function ContractorLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('contractor_token', data.token)
        
        // Redirect to dashboard
        router.push('/contractor/dashboard')
      } else {
        setError(data.error || 'Login failed')
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
        <title>Contractor Login - LookupContractor</title>
        <meta name="description" content="Sign in to your contractor account dashboard" />
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
              Contractor Sign In
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
              Access your dashboard to manage your contractor profile
            </p>
          </div>
        </header>

        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '3rem 2rem' }}>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
              Welcome Back
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

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Email Address
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Your password"
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
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
              Don't have an account? {' '}
              <Link href="/contractor/register" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Register here
              </Link>
            </div>
          </div>

          {/* Quick Benefits */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            marginTop: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>
              🎯 Manage Your Business Profile
            </h3>
            <ul style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'left', paddingLeft: '1.5rem' }}>
              <li>Update business description & website</li>
              <li>Add photos to showcase your work</li>
              <li>Get verified contractor badge</li>
              <li>Track profile performance</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}