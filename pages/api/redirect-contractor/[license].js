const { executeQuery } = require('../../../lib/database.js')
const { createContractorUrl } = require('../../../utils/urlHelpers')

export default async function handler(req, res) {
  const { license } = req.query

  if (!license) {
    return res.status(404).json({ error: 'License number required' })
  }

  try {
    const result = await executeQuery(`
      SELECT license_no, business_name, city, primary_status, expiration_date, trade, primary_classification
      FROM contractors 
      WHERE license_no = $1
      LIMIT 1
    `, [license])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contractor not found' })
    }

    const contractor = result.rows[0]
    const newUrl = createContractorUrl(contractor)
    
    // Permanent redirect to new SEO-friendly URL
    res.status(301).redirect(newUrl)

  } catch (error) {
    console.error('Redirect contractor error:', error)
    res.status(500).json({ error: 'Failed to redirect contractor' })
  }
}