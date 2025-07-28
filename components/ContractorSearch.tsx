'use client'

import { useState } from 'react'

interface Contractor {
  id: number
  license_no: string
  business_name: string
  city: string
  county: string
  zip_code: string
  business_phone: string
  primary_status: string
  primary_classification: string
  trade: string
  issue_date: string
  expiration_date: string
  mailing_address: string
}

export default function ContractorSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('license')
  const [results, setResults] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError('')
    setResults([])

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: searchTerm.trim(),
          searchType
        }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.contractors || [])
      
      if (data.contractors?.length === 0) {
        setError('No contractors found for your search')
      }
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatPhone = (phone: string) => {
    if (!phone) return 'N/A'
    // Basic phone formatting
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2 mb-4">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="license">License Number</option>
            <option value="business">Business Name</option>
            <option value="city">City</option>
            <option value="classification">Classification</option>
          </select>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Enter ${searchType === 'license' ? 'license number' : 
                         searchType === 'business' ? 'business name' :
                         searchType === 'city' ? 'city name' : 'classification code'}`}
            className="search-input flex-1"
            disabled={loading}
          />
          
          <button 
            type="submit" 
            className="search-button"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner">Searching contractors...</div>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p className="text-gray-600 mb-4">
            Found {results.length} contractor{results.length !== 1 ? 's' : ''}
          </p>
          
          <div className="space-y-4">
            {results.map((contractor) => (
              <div key={contractor.id} className="contractor-card">
                <div className="contractor-name">
                  {contractor.business_name}
                </div>
                
                <div className="contractor-details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>License #:</strong> {contractor.license_no}<br />
                      <strong>Classification:</strong> {contractor.primary_classification || 'N/A'}<br />
                      <strong>Trade:</strong> {contractor.trade || 'N/A'}<br />
                      <strong>Status:</strong> 
                      <span className={contractor.primary_status === 'CLEAR' ? 'status-active' : 'status-inactive'}>
                        {contractor.primary_status || 'N/A'}
                      </span>
                    </div>
                    
                    <div>
                      <strong>Address:</strong> {contractor.mailing_address || 'N/A'}<br />
                      <strong>City:</strong> {contractor.city}, {contractor.county || ''}<br />
                      <strong>ZIP:</strong> {contractor.zip_code || 'N/A'}<br />
                      <strong>Phone:</strong> {formatPhone(contractor.business_phone)}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <strong>Issue Date:</strong> {formatDate(contractor.issue_date)} | 
                    <strong> Expiration:</strong> {formatDate(contractor.expiration_date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}