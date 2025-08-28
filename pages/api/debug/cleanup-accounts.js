import { executeQuery } from '../../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST to confirm deletion.' })
  }

  const { confirm } = req.body

  if (confirm !== 'DELETE_ALL_ACCOUNTS') {
    return res.status(400).json({ 
      error: 'Confirmation required', 
      message: 'Send POST request with { "confirm": "DELETE_ALL_ACCOUNTS" } to proceed' 
    })
  }

  try {
    console.log('🗑️ Starting cleanup of all contractor accounts...')
    
    // First, get count of what we're about to delete
    const accountsResult = await executeQuery('SELECT COUNT(*) as count FROM contractor_accounts')
    const verificationResult = await executeQuery('SELECT COUNT(*) as count FROM verification_requests')
    
    const accountsCount = accountsResult.rows[0]?.count || 0
    const verificationsCount = verificationResult.rows[0]?.count || 0

    console.log(`Found ${accountsCount} contractor accounts and ${verificationsCount} verification requests`)

    // Delete verification requests first (foreign key dependency)
    await executeQuery('DELETE FROM verification_requests')
    console.log('✅ Deleted all verification requests')

    // Delete contractor accounts
    await executeQuery('DELETE FROM contractor_accounts')
    console.log('✅ Deleted all contractor accounts')

    res.status(200).json({
      success: true,
      message: 'All contractor accounts and verification requests have been deleted',
      deleted: {
        contractor_accounts: accountsCount,
        verification_requests: verificationsCount
      }
    })

  } catch (error) {
    console.error('Error during cleanup:', error)
    res.status(500).json({ 
      error: 'Failed to cleanup accounts', 
      details: error.message 
    })
  }
}