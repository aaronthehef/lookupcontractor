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

    // Get all states (assuming you expand beyond California)
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Static Pages -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/search-results</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/contractors/california</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Legal Pages -->
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms-of-service</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/disclaimer</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/data-sources</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/copyright</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>`

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
    res.setHeader('Cache-Control', 'public, max-age=86400') // Cache for 24 hours
    res.status(200).send(sitemap)

  } catch (error) {
    console.error('Comprehensive sitemap generation error:', error)
    res.status(500).json({ error: 'Failed to generate comprehensive sitemap' })
  }
}

