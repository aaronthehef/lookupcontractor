const { pool, executeQuery } = require('../../lib/database.js')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('=== QUERY COMPARISON TEST ===')
    
    // Test 1: Using pool.query (like state-stats API)
    const poolResult = await pool.query(`
      SELECT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE state = 'CA' 
      AND city = 'LOS ANGELES'
      GROUP BY city
    `)
    
    console.log('Pool query result:', poolResult.rows)
    
    // Test 2: Using executeQuery (like my test APIs)
    const executeResult = await executeQuery(`
      SELECT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE state = 'CA' 
      AND city = 'LOS ANGELES'
      GROUP BY city
    `)
    
    console.log('ExecuteQuery result:', executeResult.rows)
    
    // Test 3: Compare total contractors
    const poolTotal = await pool.query(`
      SELECT COUNT(*) as total
      FROM contractors 
      WHERE state = 'CA'
    `)
    
    const executeTotal = await executeQuery(`
      SELECT COUNT(*) as total
      FROM contractors 
      WHERE state = 'CA'
    `)

    return res.status(200).json({
      success: true,
      poolLosAngeles: poolResult.rows[0]?.contractor_count || 0,
      executeLosAngeles: executeResult.rows[0]?.contractor_count || 0,
      poolTotal: parseInt(poolTotal.rows[0].total),
      executeTotal: parseInt(executeTotal.rows[0].total),
      raw: {
        poolResult: poolResult.rows,
        executeResult: executeResult.rows
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Query comparison error:', error)
    return res.status(500).json({ 
      error: 'Query comparison failed',
      details: error.message
    })
  }
}