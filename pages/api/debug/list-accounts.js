import { executeQuery } from '../../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('📋 Listing all contractor accounts...')
    
    // Get all contractor accounts with business info
    const result = await executeQuery(`
      SELECT 
        ca.id,
        ca.license_no,
        ca.email,
        ca.phone_number,
        ca.phone_verified,
        ca.tier,
        ca.created_at,
        ca.verified_at,
        c.business_name,
        c.city,
        c.state
      FROM contractor_accounts ca
      LEFT JOIN contractors c ON ca.license_no = c.license_no
      ORDER BY ca.created_at DESC
    `)

    // Also get verification requests
    const verificationResult = await executeQuery(`
      SELECT license_no, phone_number, status, created_at
      FROM verification_requests 
      ORDER BY created_at DESC
      LIMIT 10
    `)

    res.status(200).json({
      accounts: result.rows || [],
      verificationRequests: verificationResult.rows || []
    })

  } catch (error) {
    console.error('Error listing accounts:', error)
    res.status(500).json({ error: 'Failed to list accounts', details: error.message })
  }
}