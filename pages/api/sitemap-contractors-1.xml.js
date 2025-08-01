const pool = require('../../lib/database.js')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const page = 1
  const limit = 40000 // 40k URLs per sitemap
  const offset = (page - 1) * limit
  
  try {
    const result = await pool.query(`
      SELECT license_no, business_name, city, primary_status, expiration_date
      FROM contractors 
      WHERE business_name IS NOT NULL
      ORDER BY license_no
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    const baseUrl = 'https://lookupcontractor.com'
    const currentDate = new Date().toISOString().split('T')[0]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    result.rows.forEach(contractor => {
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
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.status(200).send(sitemap)

  } catch (error) {
    console.error('Contractor sitemap page 1 error:', error)
    res.status(500).json({ error: 'Failed to generate contractor sitemap page 1' })
  }
}