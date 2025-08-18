// Server-side geocoding API to bypass CORS issues
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { address } = req.body

  if (!address) {
    return res.status(400).json({ error: 'Address is required' })
  }

  try {
    console.log('🗺️ Geocoding address:', address)
    
    // Use server-side fetch to Nominatim (no CORS issues)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'LookupContractor-MapService/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`Geocoding service error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      console.log('🗺️ Geocoding success:', data[0])
      return res.status(200).json({
        success: true,
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name
      })
    } else {
      console.log('🗺️ Geocoding failed: No results')
      return res.status(404).json({
        success: false,
        error: 'Location not found'
      })
    }
    
  } catch (error) {
    console.error('🗺️ Geocoding error:', error.message)
    return res.status(500).json({
      success: false,
      error: 'Geocoding service unavailable'
    })
  }
}