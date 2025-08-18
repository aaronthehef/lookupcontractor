import { executeQuery } from '../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { 
    business_name, 
    license_number, 
    contact_name, 
    contact_email, 
    phone_number,
    contractor_id,
    source 
  } = req.body

  // Basic validation
  if (!business_name || !contact_email || !phone_number) {
    return res.status(400).json({ error: 'Business name, email, and phone are required' })
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(contact_email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }

  try {
    // Create the table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS free_site_leads (
        id SERIAL PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        license_number VARCHAR(50),
        contact_name VARCHAR(255) NOT NULL,
        contact_email VARCHAR(255) NOT NULL,
        phone_number VARCHAR(50) NOT NULL,
        contractor_id INTEGER,
        source VARCHAR(100),
        status VARCHAR(50) DEFAULT 'new',
        discovery_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert the lead
    const result = await executeQuery(`
      INSERT INTO free_site_leads (
        business_name, 
        license_number, 
        contact_name, 
        contact_email, 
        phone_number,
        contractor_id,
        source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      business_name,
      license_number || null,
      contact_name,
      contact_email,
      phone_number,
      contractor_id || null,
      source || 'direct'
    ])

    const leadId = result.rows[0].id

    // Send notification email (you'll need to implement this based on your email setup)
    try {
      await sendNotificationEmail({
        leadId,
        business_name,
        license_number,
        contact_name,
        contact_email,
        phone_number,
        source
      })
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError)
      // Don't fail the request if email fails
    }

    res.status(200).json({ 
      success: true, 
      leadId,
      message: 'Lead created successfully' 
    })

  } catch (error) {
    console.error('Error creating free site lead:', error)
    res.status(500).json({ error: 'Failed to submit form. Please try again.' })
  }
}

async function sendNotificationEmail(leadData) {
  // TODO: Implement email notification
  // For now, just log the lead data
  console.log('🚀 New Free Site Lead:', {
    id: leadData.leadId,
    business: leadData.business_name,
    license: leadData.license_number,
    contact: leadData.contact_name,
    email: leadData.contact_email,
    phone: leadData.phone_number,
    source: leadData.source,
    timestamp: new Date().toISOString()
  })
  
  // In a real implementation, you would use:
  // - SendGrid, Mailgun, or AWS SES for transactional emails
  // - Slack webhook for instant notifications
  // - Your CRM API to create the lead there
}