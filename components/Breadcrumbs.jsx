import Link from 'next/link'

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null

  return (
    <nav style={{ 
      padding: '1rem 0', 
      fontSize: '0.95rem',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <ol style={{ 
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: '0 1rem',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        {items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
            {index > 0 && (
              <span style={{ 
                margin: '0 0.75rem',
                color: '#64748b',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                →
              </span>
            )}
            {item.href ? (
              <Link 
                href={item.href}
                style={{
                  color: '#1d4ed8',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dbeafe'
                  e.target.style.textDecoration = 'underline'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.textDecoration = 'none'
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ 
                color: '#1f2937',
                fontWeight: '600',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                border: '1px solid #e5e7eb'
              }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}