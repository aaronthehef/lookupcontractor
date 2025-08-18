// Verify contractor ownership with phone verification code
import jwt from 'jsonwebtoken'
import { executeQuery } from '../../../lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this'
const MAX_ATTEMPTS = 3

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token, verificationCode } = req.body

  if (!token || !verificationCode) {
    return res.status(400).json({ error: 'Token and verification code are required' })
  }

  try {
    // 1. Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET)

    // 2. Find verification request
    const verificationResult = await executeQuery(
      `SELECT * FROM verification_requests 
       WHERE license_no = ? AND status = 'pending' 
       ORDER BY created_at DESC LIMIT 1`,
      [decoded.license_no]
    )

    if (!verificationResult.rows || verificationResult.rows.length === 0) {
      return res.status(404).json({ error: 'No pending verification request found' })
    }

    const verification = verificationResult.rows[0]

    // 3. Check if expired
    if (new Date() > new Date(verification.expires_at)) {
      await executeQuery(
        'UPDATE verification_requests SET status = \'expired\' WHERE id = ?',
        [verification.id]
      )
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' })
    }

    // 4. Check attempts limit
    if (verification.attempts >= MAX_ATTEMPTS) {
      await executeQuery(
        'UPDATE verification_requests SET status = \'failed\' WHERE id = ?',
        [verification.id]
      )
      return res.status(400).json({ error: 'Too many failed attempts. Please request a new verification code.' })
    }

    // 5. Increment attempts
    await executeQuery(
      'UPDATE verification_requests SET attempts = attempts + 1 WHERE id = ?',
      [verification.id]
    )

    // 6. Check if code matches
    if (verificationCode !== verification.verification_code) {
      const attemptsLeft = MAX_ATTEMPTS - (verification.attempts + 1)
      return res.status(400).json({ 
        error: `Invalid verification code. ${attemptsLeft} attempts remaining.` 
      })
    }

    // 7. SUCCESS! Mark as verified
    await executeQuery(
      'UPDATE verification_requests SET status = \'verified\', verified_at = datetime(\'now\') WHERE id = ?',
      [verification.id]
    )

    // 8. Update contractor account as phone verified
    await executeQuery(
      'UPDATE contractor_accounts SET phone_verified = 1, verified_at = datetime(\'now\') WHERE license_no = ?',
      [decoded.license_no]
    )

    // 9. Get updated account info
    const accountResult = await executeQuery(
      `SELECT ca.*, c.business_name, c.city, c.state 
       FROM contractor_accounts ca
       JOIN contractors c ON ca.license_no = c.license_no
       WHERE ca.license_no = ?`,
      [decoded.license_no]
    )

    const account = accountResult.rows[0]

    res.status(200).json({
      success: true,
      message: 'Business ownership verified successfully!',
      contractor: {
        id: account.id,
        license_no: account.license_no,
        email: account.email,
        business_name: account.business_name,
        city: account.city,
        state: account.state,
        tier: account.tier,
        phone_verified: true,
        verified_at: account.verified_at
      }
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    
    console.error('Code verification error:', error)
    res.status(500).json({ error: 'Failed to verify code' })
  }
}