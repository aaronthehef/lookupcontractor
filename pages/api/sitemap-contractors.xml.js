const pool = require('../../lib/database.js')

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { page = 1, limit = 10000 } = req.query
  const offset = (parseInt(page) - 1) * parseInt(limit)
  
  try {

    // Get contractors with pagination
    const result = await pool.query(`
      SELECT license_no, business_name, city, primary_status, expiration_date
      FROM contractors 
      WHERE primary_status = 'CLEAR' 
      AND business_name IS NOT NULL
      ORDER BY license_no
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    const baseUrl = 'https://lookupcontractor.com'
    const currentDate = new Date().toISOString().split('T')[0]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    // Add contractor pages
    result.rows.forEach(contractor => {
      // Calculate last modified date based on expiration or current date
      const lastmod = contractor.expiration_date 
        ? new Date(contractor.expiration_date).toISOString().split('T')[0]
        : currentDate

      sitemap += `
  <url>
    <loc>${baseUrl}/contractor/${contractor.license_no}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    sitemap += `
</urlset>`

    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, max-age=86400') // Cache for 24 hours
    res.status(200).send(sitemap)

  } catch (error) {
    console.error('Contractor sitemap generation error:', error)
    res.status(500).json({ error: 'Failed to generate contractor sitemap' })
  }
}

module.exports = handler
