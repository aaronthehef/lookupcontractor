import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { executeQuery } from '../lib/database.mjs'
import { createContractorUrl, createSlug } from '../utils/urlHelpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Generate Static Sitemap Files
 * Creates XML files in /public directory for instant loading
 */

const URLS_PER_SITEMAP = 5000
const BASE_URL = 'https://www.lookupcontractor.com'

async function generateStaticSitemaps() {
  console.log('🚀 Starting static sitemap generation...')
  
  const publicDir = path.join(__dirname, '..', 'public')
  const currentDate = new Date().toISOString().split('T')[0]
  
  try {
    // 1. Generate static pages sitemap
    console.log('📄 Generating static pages sitemap...')
    await generateStaticPagesSitemap(publicDir, currentDate)
    
    // 2. Generate contractor sitemaps
    console.log('👷 Generating contractor sitemaps...')
    const contractorSitemaps = await generateContractorSitemaps(publicDir, currentDate)
    
    // 3. Generate sitemap index
    console.log('🗂️  Generating sitemap index...')
    await generateSitemapIndex(publicDir, currentDate, contractorSitemaps)
    
    console.log('🎉 Static sitemap generation complete!')
    console.log(`📁 Generated files in: ${publicDir}`)
    
  } catch (error) {
    console.error('❌ Error generating static sitemaps:', error)
    process.exit(1)
  } finally {
    // Don't close pool here - let the process handle it
  }
}

async function generateStaticPagesSitemap(publicDir, currentDate) {
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

  // Get city pages
  const citiesResult = await executeQuery(`
    SELECT city, COUNT(*) as contractor_count
    FROM contractors 
    WHERE city IS NOT NULL 
      AND business_name IS NOT NULL
    GROUP BY city
    ORDER BY contractor_count DESC
    LIMIT 1000
  `)

  // Get category pages
  const categoriesResult = await executeQuery(`
    SELECT 
      COALESCE(trade, primary_classification) as category,
      COUNT(*) as contractor_count
    FROM contractors 
    WHERE business_name IS NOT NULL
      AND (trade IS NOT NULL OR primary_classification IS NOT NULL)
    GROUP BY COALESCE(trade, primary_classification)
    ORDER BY contractor_count DESC
    LIMIT 200
  `)

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  })

  // Add city pages
  citiesResult.rows.forEach(cityRow => {
    const citySlug = createSlug(cityRow.city)
    sitemap += `
  <url>
    <loc>${BASE_URL}/contractors/california/${citySlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  })

  // Add category pages
  categoriesResult.rows.forEach(categoryRow => {
    const categorySlug = createSlug(categoryRow.category)
    sitemap += `
  <url>
    <loc>${BASE_URL}/contractor-types/${categorySlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  })

  sitemap += `
</urlset>`

  // Write to file
  const filename = path.join(publicDir, 'sitemap-pages.xml')
  fs.writeFileSync(filename, sitemap)
  
  const totalUrls = staticPages.length + citiesResult.rows.length + categoriesResult.rows.length
  console.log(`✅ Generated sitemap-pages.xml with ${totalUrls} URLs`)
  
  return totalUrls
}

async function generateContractorSitemaps(publicDir, currentDate) {
  // Get all contractors in one query
  console.log('📊 Fetching all contractors from database...')
  const result = await executeQuery(`
    SELECT 
      license_no,
      business_name,
      city,
      primary_status,
      expiration_date,
      trade,
      primary_classification
    FROM contractors 
    WHERE business_name IS NOT NULL 
      AND city IS NOT NULL
    ORDER BY license_no
  `)

  const allContractors = result.rows
  const totalContractors = allContractors.length
  const totalSitemaps = Math.ceil(totalContractors / URLS_PER_SITEMAP)
  
  console.log(`📈 Processing ${totalContractors} contractors into ${totalSitemaps} sitemaps`)

  const sitemapFiles = []

  // Generate sitemap files
  for (let i = 0; i < totalSitemaps; i++) {
    const pageNum = i + 1
    const startIndex = i * URLS_PER_SITEMAP
    const endIndex = Math.min(startIndex + URLS_PER_SITEMAP, totalContractors)
    const pageContractors = allContractors.slice(startIndex, endIndex)

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    pageContractors.forEach(contractor => {
      // Calculate lastmod date
      let lastmod = currentDate
      if (contractor.expiration_date) {
        lastmod = new Date(contractor.expiration_date).toISOString().split('T')[0]
      }

      // Generate SEO-friendly URL
      const contractorUrl = createContractorUrl(contractor)
      
      sitemap += `
  <url>
    <loc>${BASE_URL}${contractorUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    sitemap += `
</urlset>`

    // Write sitemap file
    const filename = `sitemap-contractors-${pageNum}.xml`
    const filepath = path.join(publicDir, filename)
    fs.writeFileSync(filepath, sitemap)
    
    sitemapFiles.push(filename)
    console.log(`✅ Generated ${filename} with ${pageContractors.length} contractors`)
  }

  return sitemapFiles
}

async function generateSitemapIndex(publicDir, currentDate, contractorSitemaps) {
  let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`

  // Add contractor sitemaps
  contractorSitemaps.forEach(filename => {
    sitemapIndex += `
  <sitemap>
    <loc>${BASE_URL}/${filename}</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`
  })

  sitemapIndex += `
</sitemapindex>`

  // Write sitemap index
  const filepath = path.join(publicDir, 'sitemap-index.xml')
  fs.writeFileSync(filepath, sitemapIndex)
  
  console.log(`✅ Generated sitemap-index.xml with ${contractorSitemaps.length + 1} sitemaps`)
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticSitemaps()
    .then(() => {
      console.log('🏁 Script completed successfully')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Script failed:', error)
      process.exit(1)
    })
}

export default generateStaticSitemaps