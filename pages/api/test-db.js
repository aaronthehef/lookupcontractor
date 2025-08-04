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
    
    // Test 2: Count Los Angeles contractors
    const laCountResult = await executeQuery(`
      SELECT COUNT(*) as la_total
      FROM contractors 
      WHERE state = 'CA' AND city = 'LOS ANGELES'
    `)
    
    // Test 3: Count C-36 plumbers in LA
    const plumbersCountResult = await executeQuery(`
      SELECT COUNT(*) as plumbers_total
      FROM contractors 
      WHERE state = 'CA' 
      AND primary_classification = 'C-36'
      AND city = 'LOS ANGELES'
    `)
    
    // Test 4: Get sample contractors from Los Angeles
    const laResult = await executeQuery(`
      SELECT license_no, business_name, city, primary_classification, trade
      FROM contractors 
      WHERE state = 'CA' AND city = 'LOS ANGELES'
      LIMIT 5
    `)
    
    // Test 5: Check what cities exist that contain "angeles"
    const angelesResult = await executeQuery(`
      SELECT DISTINCT city, COUNT(*) as count
      FROM contractors 
      WHERE state = 'CA' AND city ILIKE '%angeles%'
      GROUP BY city
      ORDER BY count DESC
    `)
    
    console.log('LA result:', laResult)
    console.log('Angeles variations:', angelesResult)

    return res.status(200).json({
      success: true,
      totalContractors: parseInt(countResult.rows[0]?.total_contractors || 0),
      losAngelesCount: parseInt(laCountResult.rows[0]?.la_total || 0),
      losAngelesPlumbersCount: parseInt(plumbersCountResult.rows[0]?.plumbers_total || 0),
      losAngelesSample: laResult.rows || [],
      angelesVariations: angelesResult.rows || [],
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