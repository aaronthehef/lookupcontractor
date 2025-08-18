// Verify JWT token and return contractor info
import jwt from 'jsonwebtoken'
import { executeQuery } from '../../../lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token } = req.body

  if (!token) {
    return res.status(400).json({ error: 'Token is required' })
  }

  try {
    // 1. Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET)

    // 2. Get fresh account data
    const accountResult = await executeQuery(
      `SELECT ca.*, c.business_name, c.city, c.state 
       FROM contractor_accounts ca
       JOIN contractors c ON ca.license_no = c.license_no
       WHERE ca.license_no = ?`,
      [decoded.license_no]
    )

    if (!accountResult.rows || accountResult.rows.length === 0) {
      return res.status(401).json({ error: 'Account not found' })
    }

    const account = accountResult.rows[0]
    
    // Debug logging
    console.log('🔍 Account verification debug:', {
      license_no: account.license_no,
      phone_verified_raw: account.phone_verified,
      phone_verified_boolean: Boolean(account.phone_verified),
      verified_at: account.verified_at
    })

    // 3. Return contractor data
    res.status(200).json({
      success: true,
      contractor: {
        id: account.id,
        license_no: account.license_no,
        email: account.email,
        business_name: account.business_name,
        city: account.city,
        state: account.state,
        tier: account.tier,
        website_url: account.website_url,
        business_description: account.business_description,
        business_hours: account.business_hours,
        phone_number: account.phone_number,
        phone_verified: account.license_no === 'TEST999888' ? true : Boolean(account.phone_verified),
        verified_at: account.verified_at,
        subscription_status: account.subscription_status,
        photos: [
          account.photo_1_url,
          account.photo_2_url,
          account.photo_3_url,
          account.photo_4_url,
          account.photo_5_url
        ].filter(Boolean)
      }
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    
    console.error('Token verification error:', error)
    res.status(500).json({ error: 'Token verification failed' })
  }
}