const { pool, executeQuery } = require('../../lib/database.js')
const cache = require('../../lib/cache.js')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { classification } = req.query
  
  if (!classification) {
    return res.status(400).json({ error: 'Classification parameter required' })
  }
  
  // Generate cache key
  const cacheKey = `classification-stats-${classification.toLowerCase()}`
  
  // Check cache first
  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    console.log('Serving classification stats from cache for:', classification)
    return res.status(200).json(cachedData)
  }
  
  try {
    // Get total contractor count for classification
    const totalResult = await executeQuery(`
      SELECT COUNT(*) as total_contractors
      FROM contractors 
      WHERE primary_classification = $1
        AND business_name IS NOT NULL
    `, [classification.toUpperCase()])

    // Get active contractor count (CLEAR, ACTIVE, or NULL status)
    const activeResult = await executeQuery(`
      SELECT COUNT(*) as active_contractors
      FROM contractors 
      WHERE primary_classification = $1
        AND business_name IS NOT NULL
        AND (primary_status = 'CLEAR' OR primary_status = 'ACTIVE' OR primary_status IS NULL)
    `, [classification.toUpperCase()])

    // Get cities count
    const citiesResult = await executeQuery(`
      SELECT COUNT(DISTINCT city) as cities_count
      FROM contractors 
      WHERE primary_classification = $1
        AND business_name IS NOT NULL
        AND city IS NOT NULL
    `, [classification.toUpperCase()])

    const stats = {
      total: parseInt(totalResult.rows[0]?.total_contractors || 0),
      active: parseInt(activeResult.rows[0]?.active_contractors || 0),
      cities: parseInt(citiesResult.rows[0]?.cities_count || 0)
    }

    // Cache for 1 hour
    cache.set(cacheKey, stats, 3600)
    
    console.log(`Classification stats for ${classification}:`, stats)
    
    return res.status(200).json(stats)
    
  } catch (error) {
    console.error('Error fetching classification stats:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch classification statistics',
      details: error.message 
    })
  }
}