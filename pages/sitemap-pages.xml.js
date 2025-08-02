const { executeQuery } = require('../lib/database.js')
const { createSlug } = require('../utils/urlHelpers')

/**
 * Static Pages Sitemap at root: /sitemap-pages.xml
 */
export default async function handler(req, res) {
  // Handle HEAD requests
  if (req.method === 'HEAD') {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const baseUrl = 'https://www.lookupcontractor.com'
    const currentDate = new Date().toISOString().split('T')[0]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    // Core static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/search', priority: '0.9', changefreq: 'weekly' },
      { url: '/contractors/california', priority: '0.8', changefreq: 'weekly' },
      { url: '/contractor-types', priority: '0.7', changefreq: 'monthly' },
      { url: '/about', priority: '0.5', changefreq: 'monthly' },
      { url: '/contact', priority: '0.5', changefreq: 'monthly' },
      { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly' }
    ]

    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    })

    // Dynamic city pages (top cities by contractor count)
    const citiesResult = await executeQuery(`
      SELECT city, COUNT(*) as contractor_count
      FROM contractors 
      WHERE city IS NOT NULL 
        AND business_name IS NOT NULL
        AND (primary_status = 'Active' OR primary_status = 'Current')
      GROUP BY city
      ORDER BY contractor_count DESC
      LIMIT 1000
    `)

    citiesResult.rows.forEach(cityRow => {
      const citySlug = createSlug(cityRow.city)
      sitemap += `
  <url>
    <loc>${baseUrl}/contractors/california/${citySlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    // Category pages (top categories by contractor count)
    const categoriesResult = await executeQuery(`
      SELECT 
        COALESCE(trade, primary_classification) as category,
        COUNT(*) as contractor_count
      FROM contractors 
      WHERE business_name IS NOT NULL
        AND (primary_status = 'Active' OR primary_status = 'Current')
        AND (trade IS NOT NULL OR primary_classification IS NOT NULL)
      GROUP BY COALESCE(trade, primary_classification)
      ORDER BY contractor_count DESC
      LIMIT 200
    `)

    categoriesResult.rows.forEach(categoryRow => {
      const categorySlug = createSlug(categoryRow.category)
      sitemap += `
  <url>
    <loc>${baseUrl}/contractor-types/${categorySlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    })

    sitemap += `
</urlset>`

    // Set proper headers
    res.setHeader('Content-Type', 'text/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    
    const urlCount = staticPages.length + citiesResult.rows.length + categoriesResult.rows.length
    res.setHeader('X-URL-Count', urlCount)
    
    res.status(200).send(sitemap)

  } catch (error) {
    console.error('Pages sitemap generation error:', error)
    res.status(500).json({ 
      error: 'Failed to generate pages sitemap',
      timestamp: new Date().toISOString()
    })
  }
}