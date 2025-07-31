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
    if (contractor) {
      geocodeAddress()
    }
  }, [contractor])

  const geocodeAddress = async () => {
    try {
      // Build address string from available data
      const addressParts = []
      if (contractor.mailing_address) addressParts.push(contractor.mailing_address)
      if (contractor.city) addressParts.push(contractor.city)
      if (contractor.state) addressParts.push(contractor.state)
      if (contractor.zip_code) addressParts.push(contractor.zip_code)
      
      const address = addressParts.join(', ')
      
      if (!address) {
        setError('No address available')
        setLoading(false)
        return
      }

      // Use Nominatim (OpenStreetMap) geocoding service (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      
      const data = await response.json()
      
      if (data && data.length > 0) {
        setCoordinates({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        })
      } else {
        setError('Address not found')
      }
    } catch (err) {
      setError('Failed to load map')
      console.error('Geocoding error:', err)
    } finally {
      setLoading(false)
    }
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

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={15}
        style={{ height: '300px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lng]}>
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                {contractor.business_name}
              </h3>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                License #{contractor.license_no}
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
    </div>
  )
}