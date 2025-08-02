const { pool, executeQuery } = require('../../lib/database.js')
const cache = require('../../lib/cache.js')

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { state = 'california', city } = req.query

  if (!city) {
    return res.status(400).json({ error: 'City parameter required' })
  }

  // Generate cache key
  const cacheKey = `city-stats-${state.toLowerCase()}-${city.toLowerCase()}`
  
  // Check cache first
  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    console.log('Serving city stats from cache for:', city, state)
    return res.status(200).json(cachedData)
  }

  try {
    
    // Convert URL slug back to city name with proper handling
    const cityName = decodeURIComponent(city)
      .replace(/-/g, ' ')
      .toUpperCase()
      .trim()
    
    console.log('Searching for city:', cityName, 'in state:', state)
    
    // Get total contractor count for city using ILIKE for case-insensitive matching
    const totalResult = await executeQuery(`
      SELECT COUNT(*) as total_contractors
      FROM contractors 
      WHERE city ILIKE $1 AND state = 'CA'
    `, [cityName])

    // Get active contractor count (include CLEAR, ACTIVE, and NULL statuses like main search)
    const activeResult = await executeQuery(`
      SELECT COUNT(*) as active_contractors
      FROM contractors 
      WHERE city ILIKE $1 AND state = 'CA' 
      AND (primary_status IN ('CLEAR', 'ACTIVE') OR primary_status IS NULL)
    `, [cityName])

    // Get contractors by type
    const typesResult = await executeQuery(`
      SELECT primary_classification, trade, COUNT(*) as contractor_count
      FROM contractors 
      WHERE city ILIKE $1 AND state = 'CA' AND primary_classification IS NOT NULL
      GROUP BY primary_classification, trade
      ORDER BY contractor_count DESC
      LIMIT 10
    `, [cityName])

    // Get sample contractors (include CLEAR, ACTIVE, and NULL statuses like main search)
    const contractorsResult = await executeQuery(`
      SELECT license_no, business_name, primary_classification, trade, business_phone, zip_code, primary_status
      FROM contractors 
      WHERE city ILIKE $1 AND state = 'CA' 
      AND (primary_status IN ('CLEAR', 'ACTIVE') OR primary_status IS NULL)
      ORDER BY business_name
      LIMIT 20
    `, [cityName])

    // Get ZIP codes in the city
    const zipCodesResult = await executeQuery(`
      SELECT DISTINCT zip_code, COUNT(*) as contractor_count
      FROM contractors 
      WHERE city ILIKE $1 AND state = 'CA' AND zip_code IS NOT NULL
      GROUP BY zip_code
      ORDER BY contractor_count DESC
      LIMIT 10
    `, [cityName])

    const data = {
      city: cityName,
      state: state.charAt(0).toUpperCase() + state.slice(1),
      totalContractors: parseInt(totalResult.rows[0].total_contractors),
      activeContractors: parseInt(activeResult.rows[0].active_contractors),
      contractorTypes: typesResult.rows,
      sampleContractors: contractorsResult.rows,
      zipCodes: zipCodesResult.rows
    }

    // Cache the data for 20 minutes (1200000 ms)
    cache.set(cacheKey, data, 1200000)
    console.log('Cached city stats for:', cityName, state)

    res.status(200).json(data)

  } catch (error) {
    console.error('City stats error:', error)
    res.status(500).json({ error: 'Failed to fetch city statistics' })
  }
}

module.exports = handler
