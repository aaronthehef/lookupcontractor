const pool = require('../../lib/database.js')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get all unique cities for city pages
    const citiesResult = await pool.query(`
      SELECT DISTINCT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE city IS NOT NULL
      GROUP BY city
      ORDER BY contractor_count DESC
    `)

    // Get all contractor classifications/types
    const classificationsResult = await pool.query(`
      SELECT DISTINCT primary_classification, COUNT(*) as contractor_count
      FROM contractors 
      WHERE primary_classification IS NOT NULL
      GROUP BY primary_classification
      ORDER BY contractor_count DESC
    `)

    // Get all states
    const statesResult = await pool.query(`
      SELECT DISTINCT state, COUNT(*) as contractor_count
      FROM contractors 
      WHERE state IS NOT NULL
      GROUP BY state
      ORDER BY contractor_count DESC
    `)

    const baseUrl = 'https://www.lookupcontractor.com'
    const currentDate = new Date().toISOString().split('T')[0]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    // Add all state pages
    statesResult.rows.forEach(state => {
      const stateSlug = state.state.toLowerCase().replace(/\s+/g, '-')
      sitemap += `
  <url>
    <loc>${baseUrl}/state/${stateSlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    // Add all city pages (both formats)
    citiesResult.rows.forEach(city => {
      const citySlug = city.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      
      // California-specific city pages
      sitemap += `
  <url>
    <loc>${baseUrl}/contractors/california/${citySlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
      
      // General city pages (state/city format)
      sitemap += `
  <url>
    <loc>${baseUrl}/city/california/${citySlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    })

    // Add all contractor classification pages
    classificationsResult.rows.forEach(classification => {
      const classSlug = classification.primary_classification.toLowerCase().replace(/[^a-z0-9]/g, '-')
      
      // General contractor type pages
      sitemap += `
  <url>
    <loc>${baseUrl}/contractors/${classSlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
      
      // California-specific classification pages
      sitemap += `
  <url>
    <loc>${baseUrl}/contractors/california/type/${classSlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    })

    sitemap += `
</urlset>`

    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.status(200).send(sitemap)

  } catch (error) {
    console.error('Pages sitemap generation error:', error)
    res.status(500).json({ error: 'Failed to generate pages sitemap' })
  }
}