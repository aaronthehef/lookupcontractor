const pool = require('../../lib/database.js')
const cache = require('../../lib/cache.js')

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { state = 'california' } = req.query
  
  // Generate cache key
  const cacheKey = `state-stats-${state.toLowerCase()}`
  
  // Check cache first
  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    console.log('Serving state stats from cache for:', state)
    return res.status(200).json(cachedData)
  }
  
  try {

    // Get total contractor count for state (CA is stored in database)
    const totalResult = await pool.query(`
      SELECT COUNT(*) as total_contractors
      FROM contractors 
      WHERE state = 'CA'
    `)

    // Get active contractor count
    const activeResult = await pool.query(`
      SELECT COUNT(*) as active_contractors
      FROM contractors 
      WHERE state = 'CA' AND primary_status = 'CLEAR'
    `)

    // Get top cities by contractor count
    const citiesResult = await pool.query(`
      SELECT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE state = 'CA' AND city IS NOT NULL
      GROUP BY city
      ORDER BY contractor_count DESC
      LIMIT 20
    `)

    // Get top contractor types
    const typesResult = await pool.query(`
      SELECT primary_classification, trade, COUNT(*) as contractor_count
      FROM contractors 
      WHERE state = 'CA' AND primary_classification IS NOT NULL
      GROUP BY primary_classification, trade
      ORDER BY contractor_count DESC
      LIMIT 15
    `)

    // Get license status breakdown
    const statusResult = await pool.query(`
      SELECT primary_status, COUNT(*) as count
      FROM contractors 
      WHERE state = 'CA' AND primary_status IS NOT NULL
      GROUP BY primary_status
      ORDER BY count DESC
    `)

    const data = {
      state: state.charAt(0).toUpperCase() + state.slice(1),
      totalContractors: parseInt(totalResult.rows[0].total_contractors),
      activeContractors: parseInt(activeResult.rows[0].active_contractors),
      topCities: citiesResult.rows,
      topTypes: typesResult.rows,
      licenseStatuses: statusResult.rows
    }

    // Cache the data for 30 minutes (1800000 ms)
    cache.set(cacheKey, data, 1800000)
    console.log('Cached state stats for:', state)

    res.status(200).json(data)

  } catch (error) {
    console.error('State stats error:', error)
    res.status(500).json({ error: 'Failed to fetch state statistics' })
  }
}

module.exports = handler
