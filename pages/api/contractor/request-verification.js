// Request phone verification for contractor account
import jwt from 'jsonwebtoken'
import { executeQuery } from '../../../lib/database'
import twilio from 'twilio'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this'
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

console.log('Twilio config:', {
  accountSid: process.env.TWILIO_ACCOUNT_SID?.substring(0, 10) + '...',
  hasAuthToken: !!process.env.TWILIO_AUTH_TOKEN
})

export default async function handler(req, res) {
  console.log('🚀 SMS verification request received')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token } = req.body

  if (!token) {
    return res.status(401).json({ error: 'Token required' })
  }

  try {
    // 1. Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET)

    // 2. Get contractor and account info
    const result = await executeQuery(
      `SELECT ca.*, c.business_name, c.business_phone, c.mailing_address, c.city, c.state
       FROM contractor_accounts ca
       JOIN contractors c ON ca.license_no = c.license_no
       WHERE ca.license_no = ?`,
      [decoded.license_no]
    )

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' })
    }

    const account = result.rows[0]

    // 3. Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // 4. Determine which phone number to use (prefer user-entered phone number)
    const verificationPhone = account.phone_number || account.business_phone
    
    if (!verificationPhone) {
      return res.status(400).json({ error: 'No phone number available for verification' })
    }

    // 5. Store verification request
    await executeQuery(
      `INSERT OR REPLACE INTO verification_requests 
       (license_no, verification_code, phone_number, expires_at, status, created_at)
       VALUES (?, ?, ?, ?, 'pending', datetime('now'))`,
      [decoded.license_no, verificationCode, verificationPhone, expiresAt.toISOString()]
    )

    // 6. Send SMS via Twilio
    try {
      // Check if Twilio is properly configured
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        throw new Error('Twilio credentials not configured')
      }

      // Ensure phone number is in E.164 format
      const formattedPhone = verificationPhone.startsWith('+') ? verificationPhone : `+1${verificationPhone}`
      
      console.log(`Attempting to send SMS to: ${formattedPhone}`)
      
      const message = await client.messages.create({
        body: `Your LookupContractor verification code is: ${verificationCode}. Expires in 5 minutes.`,
        from: '+15063001116', // Your actual Twilio phone number
        to: formattedPhone
      })
      
      console.log(`📱 SMS sent to ${verificationPhone} for ${account.business_name}: ${message.sid}`)
    } catch (smsError) {
      console.error('SMS send error:', smsError)
      // For development, still show the code if SMS fails
      return res.status(200).json({
        success: true,
        message: 'Verification requested successfully',
        verificationCode: verificationCode, // Show for testing if SMS fails
        phone: verificationPhone,
        twilioError: smsError.message || smsError.toString(),
        instructions: `SMS failed to send to ${verificationPhone}. Twilio error: ${smsError.message || smsError.toString()}. For testing, use code: ${verificationCode}`
      })
    }

    res.status(200).json({
      success: true,
      message: 'Verification requested successfully',
      phone: verificationPhone,
      instructions: `We've sent a 6-digit verification code to ${verificationPhone}. Enter the code below to verify your business ownership.`
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    
    console.error('Verification request error:', error)
    res.status(500).json({ error: 'Failed to request verification' })
  }
}