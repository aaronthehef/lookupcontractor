import { executeQuery } from '../../lib/database'
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    // Contact Information
    business_name,
    contact_name,
    email,
    phone,
    
    // Business Details
    industry,
    service_area,
    years_in_business,
    current_website,
    
    // Business Goals
    primary_services,
    target_customers,
    current_marketing_challenges,
    website_budget,
    timeline,
    business_goals
  } = req.body

  // Basic validation
  if (!business_name || !email || !phone) {
    return res.status(400).json({ error: 'Business name, email, and phone are required' })
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }

  try {
    // Create the discovery table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS free_site_discovery (
        id SERIAL PRIMARY KEY,
        
        -- Contact Information
        business_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        
        -- Business Details
        industry VARCHAR(100),
        service_area TEXT,
        years_in_business VARCHAR(50),
        current_website VARCHAR(255),
        
        -- Business Goals
        primary_services TEXT,
        target_customers VARCHAR(100),
        current_marketing_challenges TEXT,
        website_budget VARCHAR(50),
        timeline VARCHAR(50),
        business_goals TEXT,
        
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert the discovery data
    const result = await executeQuery(`
      INSERT INTO free_site_discovery (
        business_name,
        contact_name,
        email,
        phone,
        industry,
        service_area,
        years_in_business,
        current_website,
        primary_services,
        target_customers,
        current_marketing_challenges,
        website_budget,
        timeline,
        business_goals
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [
      business_name,
      contact_name || null,
      email,
      phone,
      industry || null,
      service_area || null,
      years_in_business || null,
      current_website || null,
      primary_services || null,
      target_customers || null,
      current_marketing_challenges || null,
      website_budget || null,
      timeline || null,
      business_goals || null
    ])

    // Handle both PostgreSQL and SQLite responses
    const discoveryId = result.insertId || (result.rows && result.rows[0] && result.rows[0].id) || Date.now()

    // Send email notifications
    try {
      await sendEmailNotifications({
        discoveryId,
        business_name,
        contact_name,
        email,
        phone,
        industry,
        service_area,
        years_in_business,
        current_website,
        primary_services,
        target_customers,
        current_marketing_challenges,
        website_budget,
        timeline,
        business_goals
      })
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError)
      // Don't fail the request if email fails
    }

    res.status(200).json({ 
      success: true, 
      discoveryId,
      message: 'Discovery completed successfully' 
    })

  } catch (error) {
    console.error('Error saving discovery data:', error)
    res.status(500).json({ error: 'Failed to save discovery. Please try again.' })
  }
}

async function sendEmailNotifications(data) {
  // Send email to business owner
  await sendBusinessOwnerEmail(data)
  
  // Send notification email to admin/sales team
  await sendAdminNotificationEmail(data)
}

async function sendBusinessOwnerEmail(data) {
  // Create transporter using Zoho Mail configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.zohocloud.ca',  // Canadian datacenter
    port: 465,
    secure: true, // SSL for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: 'Your Free Website is Being Created!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🎉 Your Free Website is Being Created!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">LookupContractor & LogicPros Partnership</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${data.contact_name || 'there'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Thank you for your interest in getting a free website for <strong>${data.business_name}</strong>!</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">We've received your information and our development partner <strong>LogicPros</strong> will reach out soon to get more information about your business to customize your free example website.</p>
          
          <!-- What happens next -->
          <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 18px;">What happens next:</h3>
            <ul style="color: #047857; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>We'll contact you within 24 hours to learn more about your specific needs</li>
              <li>LogicPros will create a custom website mockup based on your business</li>
              <li>You'll receive a preview link of your personalized website</li>
              <li>We'll schedule a brief call to walk through the design together</li>
              <li>If you love it, LogicPros can make it live immediately</li>
            </ul>
          </div>
          
          <!-- Submitted Information -->
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">Your submitted information:</h3>
            <table style="width: 100%; color: #92400e; font-size: 15px;">
              <tr><td style="padding: 4px 0; width: 35%;"><strong>Business:</strong></td><td>${data.business_name}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Industry:</strong></td><td>${data.industry || 'Not specified'}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Service Area:</strong></td><td>${data.service_area || 'Not specified'}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Timeline:</strong></td><td>${data.timeline || 'Not specified'}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Primary Services:</strong></td><td>${data.primary_services || 'Not specified'}</td></tr>
            </table>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin: 30px 0 20px 0;"><strong>Questions?</strong> Just reply to this email or contact us at <a href="mailto:contact@lookupcontractor.com" style="color: #3b82f6;">contact@lookupcontractor.com</a>.</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Best regards,<br>
          <strong>The LookupContractor Team</strong><br>
          Powered by LogicPros</p>
          
          <p style="font-size: 14px; color: #666; font-style: italic;">P.S. We're excited to help grow your business online! 🚀</p>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            This email was sent from LookupContractor.com<br>
            Professional website development by LogicPros
          </p>
        </div>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
  console.log('✅ Client confirmation email sent to:', data.email)
}

async function sendAdminNotificationEmail(data) {
  // Create transporter using Zoho Mail configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.zohocloud.ca',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'aaron@logicpros.ca',
    replyTo: data.email,
    subject: `🚨 New Free Website Lead: ${data.business_name} (${data.timeline})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🚨 New Free Website Lead Alert!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">LookupContractor Discovery Form Submission</p>
          <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 6px; margin-top: 15px; display: inline-block;">
            <span style="font-weight: bold; font-size: 18px;">Priority: ${data.timeline === 'ASAP' ? '🔥 HIGH - Follow up immediately!' : '⏰ NORMAL'}</span>
          </div>
        </div>
        
        <!-- Contact Information -->
        <div style="padding: 25px; background: #f0f9ff; border-left: 4px solid #0284c7;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">👤 Contact Information</h3>
          <table style="width: 100%; font-size: 15px;">
            <tr><td style="padding: 5px 0; width: 30%;"><strong>Business Name:</strong></td><td style="padding: 5px 0;">${data.business_name}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Contact:</strong></td><td style="padding: 5px 0;">${data.contact_name || 'Not provided'}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td style="padding: 5px 0;"><a href="mailto:${data.email}" style="color: #0284c7; text-decoration: none;">${data.email}</a></td></tr>
            <tr><td style="padding: 5px 0;"><strong>Phone:</strong></td><td style="padding: 5px 0;"><a href="tel:${data.phone}" style="color: #16a34a; text-decoration: none;">${data.phone}</a></td></tr>
          </table>
        </div>
        
        <!-- Business Details -->
        <div style="padding: 25px; background: #f0fdf4; border-left: 4px solid #16a34a;">
          <h3 style="color: #14532d; margin: 0 0 15px 0; font-size: 18px;">🏢 Business Details</h3>
          <table style="width: 100%; font-size: 15px;">
            <tr><td style="padding: 5px 0; width: 30%;"><strong>Industry:</strong></td><td style="padding: 5px 0;">${data.industry || 'Not specified'}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Service Area:</strong></td><td style="padding: 5px 0;">${data.service_area || 'Not specified'}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Years in Business:</strong></td><td style="padding: 5px 0;">${data.years_in_business || 'Not specified'}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Current Website:</strong></td><td style="padding: 5px 0;">${data.current_website ? `<a href="${data.current_website}" target="_blank" style="color: #0284c7;">${data.current_website}</a>` : 'None'}</td></tr>
          </table>
        </div>
        
        <!-- Business Goals -->
        <div style="padding: 25px; background: #fefbeb; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">🎯 Business Goals & Services</h3>
          <div style="margin-bottom: 15px;">
            <strong>Primary Services:</strong><br>
            <div style="background: white; padding: 10px; border-radius: 5px; margin-top: 5px; white-space: pre-wrap;">${data.primary_services || 'Not specified'}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Target Customers:</strong> ${data.target_customers || 'Not specified'}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Marketing Challenges:</strong><br>
            <div style="background: white; padding: 10px; border-radius: 5px; margin-top: 5px; white-space: pre-wrap;">${data.current_marketing_challenges || 'Not specified'}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Website Goals:</strong><br>
            <div style="background: white; padding: 10px; border-radius: 5px; margin-top: 5px; white-space: pre-wrap;">${data.business_goals || 'Not specified'}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Budget Range:</strong> ${data.website_budget || 'Prefer not to say'}
          </div>
          <div>
            <strong>Timeline:</strong> <span style="background: ${data.timeline === 'ASAP' ? '#fca5a5' : '#d1fae5'}; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${data.timeline || 'Not specified'}</span>
          </div>
        </div>
        
        <!-- Action Required -->
        <div style="padding: 25px; background: #1f2937; color: white; text-align: center;">
          <h3 style="color: white; margin: 0 0 20px 0; font-size: 18px;">⚡ Action Required</h3>
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: left;">
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Contact ${data.contact_name || 'client'} at <a href="tel:${data.phone}" style="color: #60a5fa;">${data.phone}</a> or <a href="mailto:${data.email}" style="color: #60a5fa;">${data.email}</a> within 24 hours</li>
              <li>Gather additional business details for custom website</li>
              <li>Create website mockup based on their requirements</li>
              <li>Schedule follow-up call to present the design</li>
            </ul>
          </div>
          <p style="margin: 10px 0; font-size: 16px;">
            <a href="mailto:${data.email}?subject=Your Free LogicPros Website - Next Steps&body=Hi ${data.contact_name || 'there'},%0D%0A%0D%0AThank you for your interest in a free website for ${data.business_name}. I'd love to learn more about your business to create the perfect website mockup for you.%0D%0A%0D%0AWhen would be a good time for a brief 15-minute call?%0D%0A%0D%0ABest regards,%0D%0AAaron Hefling%0D%0ALogicPros" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px; display: inline-block;">
              📧 Email Client
            </a>
            <a href="tel:${data.phone}" 
               style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px; display: inline-block;">
              📱 Call Client
            </a>
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 13px; margin: 0 0 5px 0;">
            <strong>Lead ID:</strong> ${data.discoveryId} | <strong>Submitted:</strong> ${new Date().toLocaleString()}
          </p>
          <p style="color: #666; font-size: 12px; margin: 0;">
            LookupContractor Free Website Lead | Reply to this email to respond directly to the client
          </p>
        </div>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
  console.log('✅ Admin notification email sent to: aaron@logicpros.ca')
  
  // Also log for console visibility
  console.log('🚨 New Free Website Lead:', {
    id: data.discoveryId,
    business: data.business_name,
    contact: data.contact_name,
    email: data.email,
    phone: data.phone,
    industry: data.industry,
    timeline: data.timeline,
    priority: data.timeline === 'ASAP' ? 'HIGH' : 'NORMAL'
  })
}