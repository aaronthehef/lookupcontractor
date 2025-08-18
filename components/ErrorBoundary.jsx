import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '1rem', 
          border: '1px solid #fecaca', 
          borderRadius: '8px', 
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          margin: '1rem 0'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
            Something went wrong
          </h3>
          <p style={{ margin: '0', fontSize: '0.9rem' }}>
            {this.props.fallback || 'This section could not be displayed.'}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
