import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ContractorTypePage() {
  const router = useRouter()
  const { type } = router.query

  // Redirect to the new contractor type page structure
  useEffect(() => {
    if (type) {
      router.replace(`/contractors/california/type/${type.toLowerCase()}`)
    }
  }, [type, router])

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <div>Redirecting to updated contractor page...</div>
      </div>
    </div>
  )
}