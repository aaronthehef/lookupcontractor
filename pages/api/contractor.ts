import { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../lib/database.js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { license } = req.body

  if (!license) {
    return res.status(400).json({ error: 'License number is required' })
  }

  try {
    const { rows } = await pool.query(`
      SELECT 
        id, license_no, business_name, bus_name_2, full_business_name,
        mailing_address, city, county, state, zip_code, country,
        business_phone, business_type, issue_date, reissue_date,
        expiration_date, inactivation_date, reactivation_date,
        pending_suspension, pending_class_removal, pending_class_replace,
        primary_status, secondary_status, raw_classifications,
        classification_codes, classification_descriptions,
        primary_classification, trade, asbestos_reg,
        workers_comp_coverage_type, wc_insurance_company, wc_policy_number,
        wc_effective_date, wc_expiration_date, wc_cancellation_date,
        cb_surety_company, cb_number, cb_effective_date, cb_cancellation_date,
        cb_amount, wb_surety_company, wb_number, wb_effective_date,
        wb_cancellation_date, wb_amount, db_surety_company, db_number,
        db_effective_date, db_cancellation_date, db_amount,
        date_required, discp_case_region, db_bond_reason, db_case_no,
        created_at, updated_at
      FROM contractors 
      WHERE state = 'CA' AND license_no = $1
      LIMIT 1
    `, [license])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contractor not found' })
    }

    res.status(200).json({
      contractor: rows[0]
    })

  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database query failed' })
  }
}
