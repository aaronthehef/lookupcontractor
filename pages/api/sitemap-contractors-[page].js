const { executeQuery } = require('../../lib/database.js')
const { createContractorUrl } = require('../../utils/urlHelpers')

/**
 * Contractor Sitemap at root: /sitemap-contractors-[page].xml
 */
export default async function handler(req, res) {
  const { page } = req.query
  const pageNum = parseInt(page)

  // Validate page number
  if (!pageNum || pageNum < 1) {
    return res.status(404).json({ error: 'Invalid page number' })
  }

  // Handle HEAD requests
  if (req.method === 'HEAD') {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const URLS_PER_SITEMAP = 10000
    const offset = (pageNum - 1) * URLS_PER_SITEMAP

    // Query contractors with pagination
    const result = await executeQuery(`
      SELECT 
        license_no,
        business_name,
        city,
        primary_status,
        expiration_date,
        trade,
        primary_classification,
        last_updated
      FROM contractors 
      WHERE business_name IS NOT NULL 
        AND city IS NOT NULL
      ORDER BY license_no
      LIMIT $1 OFFSET $2
    `, [URLS_PER_SITEMAP, offset])

    // Return 404 if no contractors found for this page
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'No contractors found for this page',
        page: pageNum 
      })
    }

    const baseUrl = 'https://www.lookupcontractor.com'
    const currentDate = new Date().toISOString().split('T')[0]

    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    result.rows.forEach(contractor => {
      // Calculate lastmod date
      let lastmod = currentDate
      if (contractor.expiration_date) {
        lastmod = new Date(contractor.expiration_date).toISOString().split('T')[0]
      } else if (contractor.last_updated) {
        lastmod = new Date(contractor.last_updated).toISOString().split('T')[0]
      }

      // Generate SEO-friendly URL
      const contractorUrl = createContractorUrl(contractor)
      
      // Add URL entry
      sitemap += `
  <url>
    <loc>${baseUrl}${contractorUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    sitemap += `
</urlset>`

    // Set proper headers
    res.setHeader('Content-Type', 'text/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.setHeader('X-URL-Count', result.rows.length)
    res.setHeader('X-Page-Number', pageNum)
    res.setHeader('X-File-Size', Buffer.byteLength(sitemap, 'utf8'))
    
    res.status(200).send(sitemap)

  } catch (error) {
    console.error(`Contractor sitemap page ${pageNum} error:`, error)
    res.status(500).json({ 
      error: `Failed to generate contractor sitemap page ${pageNum}`,
      page: pageNum,
      timestamp: new Date().toISOString()
    })
  }
}