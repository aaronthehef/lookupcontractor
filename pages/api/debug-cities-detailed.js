const { executeQuery } = require('../../lib/database.js')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Test 1: Top 20 cities by contractor count
    const topCitiesResult = await executeQuery(`
      SELECT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE state = 'CA' AND city IS NOT NULL
      GROUP BY city
      ORDER BY contractor_count DESC
      LIMIT 20
    `)
    
    // Test 2: Look for any city names containing "angeles", "los", "LA"
    const angelesSearchResult = await executeQuery(`
      SELECT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE state = 'CA' 
      AND (city ILIKE '%angeles%' OR city ILIKE '%los%' OR city = 'LA')
      GROUP BY city
      ORDER BY contractor_count DESC
    `)
    
    // Test 3: Look for variations of Los Angeles
    const losAngelesVariations = await executeQuery(`
      SELECT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE state = 'CA' 
      AND (
        city = 'LOS ANGELES' OR 
        city = 'Los Angeles' OR 
        city = 'los angeles' OR
        city = 'LA' OR
        city = 'L.A.' OR
        city LIKE 'LOS ANGELES%' OR
        city LIKE '%LOS ANGELES%'
      )
      GROUP BY city
      ORDER BY contractor_count DESC
    `)
    
    // Test 4: Sample of what actual city values look like
    const citySample = await executeQuery(`
      SELECT DISTINCT city
      FROM contractors 
      WHERE state = 'CA' AND city IS NOT NULL
      ORDER BY city
      LIMIT 50
    `)

    return res.status(200).json({
      success: true,
      topCities: topCitiesResult.rows || [],
      angelesSearch: angelesSearchResult.rows || [],
      losAngelesVariations: losAngelesVariations.rows || [],
      citySample: citySample.rows?.map(row => row.city) || [],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('City debug error:', error)
    return res.status(500).json({ 
      error: 'City debug failed',
      details: error.message
    })
  }
}