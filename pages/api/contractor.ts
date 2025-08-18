import { NextApiRequest, NextApiResponse } from 'next'
import { pool, executeQuery } from '../../lib/database.js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { license } = req.body

  if (!license) {
    return res.status(400).json({ error: 'License number is required' })
  }

  try {
    const result = await executeQuery(`
      SELECT 
        c.id, c.license_no, c.business_name, c.bus_name_2, c.full_business_name,
        c.mailing_address, c.city, c.county, c.state, c.zip_code, c.country,
        c.business_phone, c.business_type, c.issue_date, c.reissue_date,
        c.expiration_date, c.inactivation_date, c.reactivation_date,
        c.pending_suspension, c.pending_class_removal, c.pending_class_replace,
        c.primary_status, c.secondary_status, c.raw_classifications,
        c.classification_codes, c.classification_descriptions,
        c.primary_classification, c.trade, c.asbestos_reg,
        c.workers_comp_coverage_type, c.wc_insurance_company, c.wc_policy_number,
        c.wc_effective_date, c.wc_expiration_date, c.wc_cancellation_date,
        c.cb_surety_company, c.cb_number, c.cb_effective_date, c.cb_cancellation_date,
        c.cb_amount, c.wb_surety_company, c.wb_number, c.wb_effective_date,
        c.wb_cancellation_date, c.wb_amount, c.db_surety_company, c.db_number,
        c.db_effective_date, c.db_cancellation_date, c.db_amount,
        c.date_required, c.discp_case_region, c.db_bond_reason, c.db_case_no,
        c.created_at, c.updated_at,
        ca.website_url, ca.business_description, ca.tier, ca.phone_verified
      FROM contractors c
      LEFT JOIN contractor_accounts ca ON c.license_no = ca.license_no
      WHERE c.state = 'CA' AND c.license_no = ?
      LIMIT 1
    `, [license])

    if (!result || result.rows.length === 0) {
      return res.status(404).json({ error: 'Contractor not found' })
    }

    const contractor = result.rows[0]
    
    // Map database fields to frontend expected names
    contractor.website = contractor.website_url
    contractor.description = contractor.business_description
    
    console.log('🗺️ Contractor data for map:', {
      license_no: contractor.license_no,
      business_name: contractor.business_name,
      mailing_address: contractor.mailing_address,
      city: contractor.city,
      state: contractor.state,
      zip_code: contractor.zip_code,
      hasRequiredFields: !!(contractor.city && contractor.state),
      website: contractor.website,
      description: contractor.description
    })

    res.status(200).json({
      contractor: contractor
    })

  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database query failed' })
  }
}
