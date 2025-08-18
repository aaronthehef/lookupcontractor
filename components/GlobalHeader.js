import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function GlobalHeader() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [contractorName, setContractorName] = useState('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }
    
    const token = localStorage.getItem('contractor_token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      if (response.ok) {
        const data = await response.json()
        setIsLoggedIn(true)
        setContractorName(data.contractor.business_name)
      } else {
        localStorage.removeItem('contractor_token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('contractor_token')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('contractor_token')
    }
    setIsLoggedIn(false)
    setContractorName('')
    router.push('/')
  }

  if (!mounted || loading) {
    return null
  }

  return (
    <header style={{
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      padding: '1rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <Link href="/" style={{ 
          color: '#333', 
          textDecoration: 'none',
          fontWeight: 'normal'
        }}>
          Search
        </Link>
        
        <Link href="/contractor-types" style={{ 
          color: '#333', 
          textDecoration: 'none',
          fontWeight: 'normal'
        }}>
          Browse
        </Link>

        {isLoggedIn && (
          <Link href="/contractor/dashboard" style={{
            color: '#333',
            textDecoration: 'none',
            fontWeight: 'normal'
          }}>
            📊 Dashboard
          </Link>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isLoggedIn ? (
            <>
              <span style={{ 
                color: '#333',
                fontWeight: 'normal'
              }}>
                {contractorName}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  color: '#333',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontWeight: 'normal',
                  textDecoration: 'underline'
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/contractor/login" style={{
                color: '#333',
                textDecoration: 'none',
                fontWeight: 'normal'
              }}>
                Sign In
              </Link>
              <Link href="/contractor/register" style={{
                color: '#333',
                textDecoration: 'none',
                fontWeight: 'normal'
              }}>
                Claim Your Page
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}