export default function LoadingError({ message, onRetry, showBackButton = true }) {
  return (
    <div style={{
      minHeight: '50vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '400px',
        textAlign: 'center',
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '1px solid #fed7d7'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>😞</div>
        <h3 style={{ fontSize: '1.3rem', color: '#dc2626', marginBottom: '1rem' }}>
          Failed to Load Data
        </h3>
        <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {message || 'We encountered an error while loading the information. This might be due to a network issue or server problem.'}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                background: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 'bold'
              }}
            >
              🔄 Try Again
            </button>
          )}
          
          {showBackButton && (
            <button
              onClick={() => window.history.back()}
              style={{
                background: '#6b7280',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              ← Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}