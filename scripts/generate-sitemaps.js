const fs = require('fs')
const path = require('path')
const pool = require('../lib/database.js')
const { createContractorUrl } = require('../utils/urlHelpers')

async function generateSitemaps() {
  console.log('🚀 Starting sitemap generation...')

  const baseUrl = 'https://www.lookupcontractor.com'
  const currentDate = new Date().toISOString().split('T')[0]
  const publicDir = path.join(__dirname, '..', 'public')
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  try {
    // Generate main sitemap (static pages)
    console.log('📄 Generating main sitemap...')
    const mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/contractor-types</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/contractors/california</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms-of-service</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemap)

    // Generate contractor sitemaps
    console.log('👷 Generating contractor sitemaps...')
    const contractorsPerSitemap = 12100 // Target exactly 50 sitemaps (605,000 / 50 = 12,100)
    const totalContractors = await pool.query('SELECT COUNT(*) FROM contractors WHERE business_name IS NOT NULL')
    const count = parseInt(totalContractors.rows[0].count)
    const totalSitemaps = Math.ceil(count / contractorsPerSitemap)

    console.log(`📊 Total contractors: ${count}, Generating ${totalSitemaps} sitemaps`)

    const sitemapPaths = [] // Don't include main sitemap in index

    for (let page = 1; page <= totalSitemaps; page++) {
      const offset = (page - 1) * contractorsPerSitemap
      
      console.log(`📋 Generating sitemap ${page}/${totalSitemaps}...`)
      
      const result = await pool.query(`
        SELECT license_no, business_name, city, primary_status, expiration_date, trade, primary_classification
        FROM contractors 
        WHERE business_name IS NOT NULL
        ORDER BY license_no
        LIMIT $1 OFFSET $2
      `, [contractorsPerSitemap, offset])

      if (result.rows.length === 0) {
        console.log(`⚠️  No contractors found for sitemap ${page}, skipping...`)
        continue
      }

      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

      result.rows.forEach(contractor => {
        const lastmod = contractor.expiration_date 
          ? new Date(contractor.expiration_date).toISOString().split('T')[0]
          : currentDate

        const contractorUrl = createContractorUrl(contractor)
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

      const filename = `sitemap-contractors-${page}.xml`
      fs.writeFileSync(path.join(publicDir, filename), sitemap)
      sitemapPaths.push(filename)
      
      console.log(`✅ Generated ${filename} with ${result.rows.length} contractors`)
    }

    // Generate sitemap index
    console.log('🗂️  Generating sitemap index...')
    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    sitemapPaths.forEach(sitemapPath => {
      sitemapIndex += `
  <sitemap>
    <loc>${baseUrl}/${sitemapPath}</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`
    })

    sitemapIndex += `
</sitemapindex>`

    fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex)

    console.log(`🎉 Sitemap generation complete!`)
    console.log(`📂 Generated ${sitemapPaths.length} sitemaps`)
    console.log(`🔗 Sitemap index: ${baseUrl}/sitemap-index.xml`)
    console.log(`📊 Total URLs: ${count + 7} (${count} contractors + 7 static pages)`)

  } catch (error) {
    console.error('❌ Error generating sitemaps:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run if called directly
if (require.main === module) {
  generateSitemaps()
}

module.exports = generateSitemaps