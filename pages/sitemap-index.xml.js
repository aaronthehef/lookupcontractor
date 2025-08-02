const { executeQuery } = require('../lib/database.js')

/**
 * Main Sitemap Index at root: /sitemap-index.xml
 * References all individual sitemap files
 */
export default async function handler(req, res) {
  // Handle HEAD requests (used by search engines)
  if (req.method === 'HEAD') {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Calculate number of sitemap files needed
    const URLS_PER_SITEMAP = 10000
    const result = await executeQuery(`
      SELECT COUNT(*) as total_count 
      FROM contractors 
      WHERE business_name IS NOT NULL 
        AND city IS NOT NULL
        AND (primary_status = 'Active' OR primary_status = 'Current')
    `)
    
    const totalUrls = parseInt(result.rows[0].total_count)
    const totalSitemaps = Math.ceil(totalUrls / URLS_PER_SITEMAP)
    
    console.log(`Sitemap Index: ${totalUrls} total URLs across ${totalSitemaps} sitemaps`)

    const baseUrl = 'https://www.lookupcontractor.com'
    const currentDate = new Date().toISOString().split('T')[0]

    // Build sitemap index XML
    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    // Add main pages sitemap
    sitemapIndex += `
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`

    // Add contractor sitemaps
    for (let i = 1; i <= totalSitemaps; i++) {
      sitemapIndex += `
  <sitemap>
    <loc>${baseUrl}/sitemap-contractors-${i}.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`
    }

    sitemapIndex += `
</sitemapindex>`

    // Set proper headers
    res.setHeader('Content-Type', 'text/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.setHeader('X-Total-URLs', totalUrls)
    res.setHeader('X-Total-Sitemaps', totalSitemaps + 1)
    
    res.status(200).send(sitemapIndex)

  } catch (error) {
    console.error('Sitemap index generation error:', error)
    res.status(500).json({ 
      error: 'Failed to generate sitemap index',
      timestamp: new Date().toISOString()
    })
  }
}