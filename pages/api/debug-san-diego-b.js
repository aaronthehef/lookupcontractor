const { executeQuery } = require('../../lib/database.js')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get exact count of B contractors in San Diego
    const exactResult = await executeQuery(`
      SELECT COUNT(*) as exact_count
      FROM contractors 
      WHERE city = 'SAN DIEGO' 
      AND state = 'CA' 
      AND primary_classification = 'B'
    `)

    // Get count using ILIKE (current API method)
    const likeResult = await executeQuery(`
      SELECT COUNT(*) as like_count
      FROM contractors 
      WHERE city = 'SAN DIEGO' 
      AND state = 'CA' 
      AND (
        primary_classification ILIKE '%B%' OR 
        raw_classifications ILIKE '%B%' OR
        trade ILIKE '%B%'
      )
    `)

    // Get sample of what classifications contain B
    const sampleResult = await executeQuery(`
      SELECT DISTINCT primary_classification, COUNT(*) as count
      FROM contractors 
      WHERE city = 'SAN DIEGO' 
      AND state = 'CA' 
      AND (
        primary_classification ILIKE '%B%' OR 
        raw_classifications ILIKE '%B%' OR
        trade ILIKE '%B%'
      )
      GROUP BY primary_classification
      ORDER BY count DESC
    `)

    return res.status(200).json({
      exactBCount: parseInt(exactResult.rows[0]?.exact_count || 0),
      likeCount: parseInt(likeResult.rows[0]?.like_count || 0),
      classificationsWithB: sampleResult.rows
    })

  } catch (error) {
    console.error('Debug San Diego B contractors error:', error)
    return res.status(500).json({ 
      error: 'Failed to debug contractors',
      details: error.message 
    })
  }
}