const { executeQuery } = require('../../lib/database.js')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Testing database connection...')
    
    // Test 1: Simple contractor count
    const countResult = await executeQuery(`
      SELECT COUNT(*) as total_contractors
      FROM contractors 
      WHERE state = 'CA'
    `)
    
    console.log('Count result:', countResult)
    
    // Test 2: Get a few contractors from Los Angeles
    const laResult = await executeQuery(`
      SELECT license_no, business_name, city, primary_classification, trade
      FROM contractors 
      WHERE state = 'CA' AND city = 'LOS ANGELES'
      LIMIT 5
    `)
    
    console.log('LA result:', laResult)
    
    // Test 3: Get plumbers specifically
    const plumbersResult = await executeQuery(`
      SELECT license_no, business_name, city, primary_classification, trade
      FROM contractors 
      WHERE state = 'CA' 
      AND primary_classification = 'C-36'
      AND city = 'LOS ANGELES'
      LIMIT 5
    `)
    
    console.log('Plumbers result:', plumbersResult)

    return res.status(200).json({
      success: true,
      totalContractors: parseInt(countResult.rows[0]?.total_contractors || 0),
      losAngelesContractors: laResult.rows || [],
      losAngelesPlumbers: plumbersResult.rows || [],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Database test error:', error)
    return res.status(500).json({ 
      error: 'Database test failed',
      details: error.message,
      stack: error.stack
    })
  }
}