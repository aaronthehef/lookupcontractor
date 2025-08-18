import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function GlobalHeader() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [contractorName, setContractorName] = useState('')
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  if (!mounted) {
    return (
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            LookupContractor
          </Link>
          <div style={{ color: 'rgba(255,255,255,0.7)' }}>Loading...</div>
        </div>
      </header>
    )
  }

  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo/Brand */}
        <Link href="/" style={{ 
          color: 'white', 
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          LookupContractor
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>

        {/* Desktop Navigation */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2rem' 
        }} className="desktop-nav">
          <Link href="/" style={{ 
            color: 'white', 
            textDecoration: 'none',
            opacity: 0.9
          }}>
            Search
          </Link>
          
          <Link href="/contractor-types" style={{ 
            color: 'white', 
            textDecoration: 'none',
            opacity: 0.9
          }}>
            Browse
          </Link>

          {/* Auth Section */}
          {loading ? (
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>...</div>
          ) : isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/contractor/dashboard" style={{
                color: 'white',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}>
                📊 Dashboard
              </Link>
              <div style={{ 
                fontSize: '0.9rem', 
                opacity: 0.8,
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {contractorName}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/contractor/login" style={{
                color: 'white',
                textDecoration: 'none',
                opacity: 0.9
              }}>
                Sign In
              </Link>
              <Link href="/contractor/register" style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                Claim Your Page
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div style={{
          display: 'none',
          background: 'rgba(0,0,0,0.9)',
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '1rem'
        }} className="mobile-nav">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.75rem',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.1)'
            }} onClick={() => setMobileMenuOpen(false)}>
              🔍 Search
            </Link>
            
            <Link href="/contractor-types" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.75rem',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.1)'
            }} onClick={() => setMobileMenuOpen(false)}>
              📋 Browse
            </Link>

            {loading ? (
              <div style={{ color: 'rgba(255,255,255,0.7)', padding: '0.75rem' }}>Loading...</div>
            ) : isLoggedIn ? (
              <>
                <Link href="/contractor/dashboard" style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(59, 130, 246, 0.8)'
                }} onClick={() => setMobileMenuOpen(false)}>
                  📊 Dashboard
                </Link>
                <div style={{ 
                  color: 'rgba(255,255,255,0.8)',
                  padding: '0.75rem',
                  fontSize: '0.9rem'
                }}>
                  Logged in as: {contractorName}
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  style={{
                    background: 'rgba(220, 38, 38, 0.8)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/contractor/login" style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.1)'
                }} onClick={() => setMobileMenuOpen(false)}>
                  🔑 Sign In
                </Link>
                <Link href="/contractor/register" style={{
                  background: 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }} onClick={() => setMobileMenuOpen(false)}>
                  ⭐ Claim Your Page
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* CSS for responsive behavior */}
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
      `}</style>
    </header>
  )
}