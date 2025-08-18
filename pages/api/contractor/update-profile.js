// Update contractor profile API
import jwt from 'jsonwebtoken'
import { executeQuery } from '../../../lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token, website_url, business_description, business_hours, phone_number } = req.body

  if (!token) {
    return res.status(401).json({ error: 'Token required' })
  }

  try {
    // 1. Verify token
    const decoded = jwt.verify(token, JWT_SECRET)

    // 2. Validate inputs
    if (website_url && !isValidUrl(website_url)) {
      return res.status(400).json({ error: 'Invalid website URL format' })
    }

    if (business_description && business_description.length > 500) {
      return res.status(400).json({ error: 'Description too long (max 500 characters)' })
    }

    // 3. Update profile
    const updateQuery = `
      UPDATE contractor_accounts 
      SET 
        website_url = ?,
        business_description = ?,
        business_hours = ?,
        phone_number = ?,
        updated_at = datetime('now')
      WHERE license_no = ?
    `

    await executeQuery(updateQuery, [
      website_url || null,
      business_description || null,
      business_hours || null,
      phone_number || null,
      decoded.license_no
    ])

    // 4. Get updated profile
    const profileResult = await executeQuery(
      `SELECT ca.*, c.business_name, c.city, c.state 
       FROM contractor_accounts ca
       JOIN contractors c ON ca.license_no = c.license_no
       WHERE ca.license_no = ?`,
      [decoded.license_no]
    )

    if (!profileResult.rows || profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    const profile = profileResult.rows[0]

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      contractor: {
        id: profile.id,
        license_no: profile.license_no,
        email: profile.email,
        business_name: profile.business_name,
        city: profile.city,
        state: profile.state,
        tier: profile.tier,
        website_url: profile.website_url,
        business_description: profile.business_description,
        business_hours: profile.business_hours,
        phone_number: profile.phone_number,
        subscription_status: profile.subscription_status,
        photos: [
          profile.photo_1_url,
          profile.photo_2_url,
          profile.photo_3_url,
          profile.photo_4_url,
          profile.photo_5_url
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
    
    console.error('Profile update error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}