export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null
  }

  const { currentPage, totalPages, hasNext, hasPrev, total } = pagination

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 7 // Show max 7 page numbers
    const halfVisible = Math.floor(maxVisible / 2)
    
    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      margin: '2rem 0',
      flexWrap: 'wrap'
    }}>
      {/* Results info */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginRight: '1rem',
        minWidth: 'fit-content'
      }}>
        Showing {((currentPage - 1) * pagination.limit) + 1}-{Math.min(currentPage * pagination.limit, total)} of {total.toLocaleString()} results
      </div>

      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        style={{
          padding: '0.5rem 0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          background: hasPrev ? 'white' : '#f9fafb',
          color: hasPrev ? '#374151' : '#9ca3af',
          cursor: hasPrev ? 'pointer' : 'not-allowed',
          fontSize: '0.9rem'
        }}
      >
        ← Previous
      </button>

      {/* First page if not visible */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span style={{ color: '#9ca3af', padding: '0.5rem' }}>...</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            background: page === currentPage ? '#3b82f6' : 'white',
            color: page === currentPage ? 'white' : '#374151',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: page === currentPage ? 'bold' : 'normal'
          }}
        >
          {page}
        </button>
      ))}

      {/* Last page if not visible */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span style={{ color: '#9ca3af', padding: '0.5rem' }}>...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        style={{
          padding: '0.5rem 0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          background: hasNext ? 'white' : '#f9fafb',
          color: hasNext ? '#374151' : '#9ca3af',
          cursor: hasNext ? 'pointer' : 'not-allowed',
          fontSize: '0.9rem'
        }}
      >
        Next →
      </button>
    </div>
  )
}