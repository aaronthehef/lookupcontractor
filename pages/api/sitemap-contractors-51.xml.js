const pool = require('../../lib/database.js')
const { createContractorUrl } = require('../../utils/urlHelpers')

export default async function handler(req, res) {
  // Handle HEAD requests (used by search engines to check if sitemap exists)
  if (req.method === 'HEAD') {
    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const page = 51
  const limit = 2000
  const offset = (page - 1) * limit
  
  try {
    const result = await pool.query(`
      SELECT license_no, business_name, city, primary_status, expiration_date, trade, primary_classification
      FROM contractors 
      WHERE business_name IS NOT NULL
      ORDER BY license_no
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    // Return empty sitemap if no results
    if (result.rows.length === 0) {
      const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`
      res.setHeader('Content-Type', 'text/xml')
      res.setHeader('Cache-Control', 'public, max-age=86400')
      return res.status(200).send(emptySitemap)
    }

    const baseUrl = 'https://www.lookupcontractor.com'
    const currentDate = new Date().toISOString().split('T')[0]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    result.rows.forEach(contractor => {
      const lastmod = contractor.expiration_date 
        ? new Date(contractor.expiration_date).toISOString().split('T')[0]
        : currentDate

      sitemap += `
  <url>
    <loc>${baseUrl}${createContractorUrl(contractor)}</loc>
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
    console.error('Contractor sitemap page 51 error:', error)
    res.status(500).json({ error: 'Failed to generate contractor sitemap page 51' })
  }
}