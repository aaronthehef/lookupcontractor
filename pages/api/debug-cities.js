const { executeQuery } = require('../../lib/database.js')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get top 50 cities by contractor count
    const citiesResult = await executeQuery(`
      SELECT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE city IS NOT NULL AND state = 'CA'
      GROUP BY city
      ORDER BY contractor_count DESC
      LIMIT 50
    `)

    // Also search for cities containing "jose" or "san"
    const joseResult = await executeQuery(`
      SELECT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE city ILIKE '%jose%' AND state = 'CA'
      GROUP BY city
      ORDER BY contractor_count DESC
    `)

    const sanResult = await executeQuery(`
      SELECT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE city ILIKE '%san%' AND state = 'CA'
      GROUP BY city
      ORDER BY contractor_count DESC
      LIMIT 20
    `)

    return res.status(200).json({
      topCities: citiesResult.rows,
      joseCities: joseResult.rows,
      sanCities: sanResult.rows
    })

  } catch (error) {
    console.error('Debug cities error:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch cities',
      details: error.message 
    })
  }
}