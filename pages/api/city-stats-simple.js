const { executeQuery } = require('../../lib/database.js')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { city } = req.query

  if (!city) {
    return res.status(400).json({ error: 'City parameter required' })
  }

  try {
    // Convert URL slug to database format (ALL CAPS)
    const cityName = decodeURIComponent(city)
      .replace(/-/g, ' ')
      .toUpperCase()
      .trim()
    
    console.log('Searching for city:', cityName)
    
    // Get total contractor count
    const totalResult = await executeQuery(`
      SELECT COUNT(*) as total_contractors
      FROM contractors 
      WHERE city = $1 AND state = 'CA'
    `, [cityName])
    
    const totalCount = parseInt(totalResult.rows[0]?.total_contractors || 0)
    
    console.log('Found contractors:', totalCount)
    
    // Return basic stats
    return res.status(200).json({
      city: cityName,
      totalContractors: totalCount,
      activeContractors: totalCount, // Simplified for now
      contractorTypes: [],
      sampleContractors: [],
      zipCodes: []
    })

  } catch (error) {
    console.error('City stats error:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch city statistics',
      details: error.message 
    })
  }
}