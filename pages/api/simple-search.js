const { executeQuery } = require('../../lib/database.js')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { searchTerm } = req.body

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term required' })
  }

  try {
    console.log('Simple search for:', searchTerm)

    // Very basic search - just search business names in Los Angeles
    const query = `
      SELECT license_no, business_name, city, primary_classification, trade, primary_status
      FROM contractors 
      WHERE state = 'CA' 
      AND city = 'LOS ANGELES'
      AND primary_classification = 'C-36'
      AND (primary_status = 'CLEAR' OR primary_status = 'ACTIVE' OR primary_status IS NULL)
      ORDER BY business_name
      LIMIT 20
    `
    
    console.log('Executing query:', query)
    
    const result = await executeQuery(query, [])
    
    console.log('Query result:', result)
    console.log('Number of rows:', result?.rows?.length || 0)

    return res.status(200).json({
      success: true,
      searchTerm: searchTerm,
      contractors: result.rows || [],
      count: result.rows?.length || 0,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Simple search error:', error)
    return res.status(500).json({ 
      error: 'Search failed',
      details: error.message,
      searchTerm: searchTerm
    })
  }
}