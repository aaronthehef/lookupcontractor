const { pool, executeQuery } = require('../../lib/database.js')

// Sitemap index that references all sitemaps
export default async function handler(req, res) {
  // Handle HEAD requests (used by search engines to check if sitemap exists)
  if (req.method === 'HEAD') {
    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const totalSitemapPages = 121 // Fixed to match our 121 created files

    const baseUrl = 'https://www.lookupcontractor.com'
    const currentDate = new Date().toISOString().split('T')[0]

    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/api/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/api/sitemap-pages.xml</loc>
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
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate') // No cache
    res.status(200).send(sitemapIndex)

  } catch (error) {
    console.error('Sitemap index generation error:', error)
    res.status(500).json({ error: 'Failed to generate sitemap index' })
  }
}