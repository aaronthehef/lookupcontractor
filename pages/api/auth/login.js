// Contractor login API
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { executeQuery } from '../../../lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    // 1. Find account by email
    const accountResult = await executeQuery(
      `SELECT ca.*, c.business_name, c.city, c.state 
       FROM contractor_accounts ca
       JOIN contractors c ON ca.license_no = c.license_no
       WHERE ca.email = ?`,
      [email]
    )

    if (!accountResult.rows || accountResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const account = accountResult.rows[0]

    // 2. Verify password
    const isValidPassword = await bcrypt.compare(password, account.password_hash)
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // 3. Update last login
    await executeQuery(
      'UPDATE contractor_accounts SET last_login = datetime(\'now\') WHERE id = ?',
      [account.id]
    )

    // 4. Generate JWT token
    const token = jwt.sign(
      { 
        id: account.id,
        license_no: account.license_no,
        email: account.email,
        tier: account.tier
      }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    )

    // 5. Return success
    res.status(200).json({
      success: true,
      token,
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
        subscription_status: account.subscription_status
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
}