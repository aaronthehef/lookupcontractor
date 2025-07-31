const pool = require('../../lib/database.js')

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get sample of contractors for main sitemap (limit for performance)
    const result = await pool.query(`
      SELECT license_no, business_name, city, primary_status
      FROM contractors 
      WHERE primary_status = 'CLEAR' 
      AND business_name IS NOT NULL
      ORDER BY license_no
      LIMIT 50000
    `)

    // Get unique cities
    const citiesResult = await pool.query(`
      SELECT DISTINCT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE city IS NOT NULL AND primary_status = 'CLEAR'
      GROUP BY city
      ORDER BY contractor_count DESC
      LIMIT 1000
    `)

    const baseUrl = 'https://lookupcontractor.com'
    const currentDate = new Date().toISOString().split('T')[0]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Search Results Page -->
  <url>
    <loc>${baseUrl}/search-results</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`

    // Add contractor pages
    result.rows.forEach(contractor => {
      const slug = contractor.business_name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)
        
      sitemap += `
  <url>
    <loc>${baseUrl}/contractor/${contractor.license_no}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    // Add city pages (conceptual - would need to create these pages)
    citiesResult.rows.slice(0, 50).forEach(city => {
      const citySlug = city.city.toLowerCase().replace(/\s+/g, '-')
      sitemap += `
  <url>
    <loc>${baseUrl}/contractors/california/${citySlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    })

    sitemap += `
</urlset>`

    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, max-age=86400') // Cache for 24 hours
    res.status(200).send(sitemap)

  } catch (error) {
    console.error('Sitemap generation error:', error)
    res.status(500).json({ error: 'Failed to generate sitemap' })
  }
}

module.exports = handler
