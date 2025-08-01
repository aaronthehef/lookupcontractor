const pool = require('../../lib/database.js')

// Sitemap index that references all sitemaps
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get total contractor count to calculate number of sitemap pages needed
    const countResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM contractors 
      WHERE business_name IS NOT NULL
    `)

    const totalContractors = parseInt(countResult.rows[0].total)
    const contractorsPerSitemap = 40000
    const totalSitemapPages = Math.ceil(totalContractors / contractorsPerSitemap)

    const baseUrl = 'https://lookupcontractor.com'
    const currentDate = new Date().toISOString().split('T')[0]

    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/api/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`

    // Add all contractor sitemap pages
    for (let page = 1; page <= totalSitemapPages; page++) {
      sitemapIndex += `
  <sitemap>
    <loc>${baseUrl}/api/sitemap-contractors-${page}.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`
    }

    sitemapIndex += `
</sitemapindex>`

    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, max-age=86400') // Cache for 24 hours
    res.status(200).send(sitemapIndex)

  } catch (error) {
    console.error('Sitemap index generation error:', error)
    res.status(500).json({ error: 'Failed to generate sitemap index' })
  }
}