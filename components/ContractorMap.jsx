import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default markers not showing
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function ContractorMap({ contractor }) {
  const [coordinates, setCoordinates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('🗺️ ContractorMap received contractor:', contractor)
    if (contractor) {
      console.log('🗺️ Map data available:', {
        hasCity: !!contractor.city,
        hasState: !!contractor.state,
        hasZip: !!contractor.zip_code,
        hasAddress: !!contractor.mailing_address,
        city: contractor.city,
        state: contractor.state,
        zip_code: contractor.zip_code
      })
      geocodeAddress()
    } else {
      console.log('🗺️ No contractor data for map')
    }
  }, [contractor])

  const geocodeAddress = async () => {
    try {
      // Try full address first
      let coordinates = await tryGeocode('full')
      
      // If full address fails, try city + state + zip
      if (!coordinates) {
        coordinates = await tryGeocode('city')
      }
      
      // If city fails, try just zip code
      if (!coordinates) {
        coordinates = await tryGeocode('zip')
      }
      
      if (coordinates) {
        setCoordinates(coordinates)
      } else {
        setError('Location not found')
      }
    } catch (err) {
      setError('Failed to load map')
      console.error('Geocoding error:', err)
    } finally {
      setLoading(false)
    }
  }

  const tryGeocode = async (type) => {
    let searchAddress = ''
    
    switch (type) {
      case 'full':
        // Build full address string
        const addressParts = []
        if (contractor.mailing_address) addressParts.push(contractor.mailing_address)
        if (contractor.city) addressParts.push(contractor.city)
        if (contractor.state) addressParts.push(contractor.state)
        if (contractor.zip_code) addressParts.push(contractor.zip_code)
        searchAddress = addressParts.join(', ')
        break
        
      case 'city':
        // Try city + state + zip (without mailing address)
        const cityParts = []
        if (contractor.city) cityParts.push(contractor.city)
        if (contractor.state) cityParts.push(contractor.state)
        if (contractor.zip_code) cityParts.push(contractor.zip_code)
        searchAddress = cityParts.join(', ')
        break
        
      case 'zip':
        // Try just zip code + state as fallback
        if (contractor.zip_code) {
          searchAddress = `${contractor.zip_code}, ${contractor.state || 'CA'}`
        }
        break
        
      default:
        return null
    }
    
    if (!searchAddress) return null
    
    console.log(`Trying geocode (${type}):`, searchAddress)
    
    // Use our server-side geocoding API to avoid CORS issues
    const response = await fetch('/api/geocode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: searchAddress })
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log(`Geocode success (${type}):`, data)
      return {
        lat: data.lat,
        lng: data.lng,
        accuracy: type // Track what level of accuracy we got
      }
    }
    
    console.log(`Geocode failed (${type}):`, data.error || 'Unknown error')
    return null
  }

  const getDirectionsUrl = () => {
    if (!coordinates) return '#'
    return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
  }

  if (loading) {
    return (
      <div style={{ 
        height: '300px', 
        background: '#f0f0f0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '8px'
      }}>
        <div>Loading map...</div>
      </div>
    )
  }

  if (error || !coordinates) {
    return (
      <div style={{ 
        height: '300px', 
        background: '#f8f9fa', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
        <div style={{ color: '#666', marginBottom: '1rem' }}>
          {error || 'Map not available'}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#888', textAlign: 'center' }}>
          <strong>Address:</strong><br />
          {contractor.mailing_address && `${contractor.mailing_address}, `}
          {contractor.city}, {contractor.state} {contractor.zip_code}
        </div>
      </div>
    )
  }

  // Determine zoom level based on accuracy
  const getZoomLevel = () => {
    switch (coordinates.accuracy) {
      case 'full': return 16  // Street level
      case 'city': return 13  // City level  
      case 'zip': return 12   // Zip code area level
      default: return 15
    }
  }

  // Get accuracy description
  const getAccuracyDescription = () => {
    switch (coordinates.accuracy) {
      case 'full': return 'Exact address'
      case 'city': return `${contractor.city} area`
      case 'zip': return `ZIP ${contractor.zip_code} area`
      default: return 'Approximate location'
    }
  }

  return (
    <div style={{ position: 'relative', maxWidth: '100%', overflow: 'hidden' }}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={getZoomLevel()}
        style={{ height: '250px', width: '100%', maxWidth: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lng]}>
          <Popup>
            <div style={{ minWidth: '150px', maxWidth: '250px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                {contractor.business_name}
              </h3>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                License #{contractor.license_no}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                📍 {getAccuracyDescription()}
              </p>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
                {contractor.mailing_address && `${contractor.mailing_address}, `}
                {contractor.city}, {contractor.state} {contractor.zip_code}
              </p>
              {contractor.business_phone && (
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
                  📞 {contractor.business_phone}
                </p>
              )}
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  display: 'inline-block'
                }}
              >
                🧭 Get Directions
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* External directions button */}
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        zIndex: 1000 
      }}>
        <a
          href={getDirectionsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'white',
            color: '#333',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🧭 Directions
        </a>
      </div>

      {/* Accuracy indicator */}
      {coordinates.accuracy !== 'full' && (
        <div style={{ 
          position: 'absolute', 
          bottom: '10px', 
          left: '10px', 
          zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.75rem',
          opacity: 0.8
        }}>
          📍 {getAccuracyDescription()}
        </div>
      )}
    </div>
  )
}