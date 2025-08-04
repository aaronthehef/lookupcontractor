const { executeQuery } = require('../../lib/database.js')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get all unique contractor classifications from the database
    const result = await executeQuery(`
      SELECT DISTINCT primary_classification, 
             trade,
             COUNT(*) as contractor_count
      FROM contractors 
      WHERE primary_classification IS NOT NULL 
      AND state = 'CA'
      GROUP BY primary_classification, trade
      ORDER BY contractor_count DESC, primary_classification
    `)

    return res.status(200).json({
      contractorTypes: result.rows,
      totalTypes: result.rows.length
    })

  } catch (error) {
    console.error('All contractor types error:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch contractor types',
      details: error.message 
    })
  }
}