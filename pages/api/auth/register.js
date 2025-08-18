// Contractor registration API
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { executeQuery } from '../../../lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { license_no, email, password, phone_number } = req.body

  // Validation
  if (!license_no || !email || !password || !phone_number) {
    return res.status(400).json({ error: 'License number, email, password, and phone number are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  try {
    // 1. Verify license exists in contractors table
    const contractorCheck = await executeQuery(
      'SELECT license_no, business_name, city, state FROM contractors WHERE license_no = ?',
      [license_no]
    )

    if (!contractorCheck.rows || contractorCheck.rows.length === 0) {
      return res.status(404).json({ error: 'License number not found in our database' })
    }

    const contractor = contractorCheck.rows[0]

    // 2. Check if account already exists
    const existingAccount = await executeQuery(
      'SELECT id FROM contractor_accounts WHERE license_no = ? OR email = ?',
      [license_no, email]
    )

    if (existingAccount.rows && existingAccount.rows.length > 0) {
      return res.status(409).json({ error: 'Account already exists for this license number or email' })
    }

    // 3. Hash password
    const saltRounds = 12
    const password_hash = await bcrypt.hash(password, saltRounds)

    // 4. Create account
    const createAccount = await executeQuery(
      `INSERT INTO contractor_accounts 
       (license_no, email, password_hash, phone_number, tier) 
       VALUES (?, ?, ?, ?, 'free')`,
      [license_no, email, password_hash, phone_number]
    )

    // 5. Generate JWT token
    const token = jwt.sign(
      { 
        license_no, 
        email,
        tier: 'free'
      }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    )

    // 6. Return success with contractor info
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      contractor: {
        license_no,
        email,
        business_name: contractor.business_name,
        city: contractor.city,
        state: contractor.state,
        tier: 'free'
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    console.error('Registration error details:', error.message, error.stack)
    res.status(500).json({ error: 'Failed to create account: ' + error.message })
  }
}