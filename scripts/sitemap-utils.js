const { executeQuery } = require('../lib/database.js')

/**
 * Sitemap Utilities for Large-Scale Website (240,000+ pages)
 * Performance monitoring, validation, and maintenance tools
 */

// Configuration constants per Google/Bing requirements
const SITEMAP_LIMITS = {
  MAX_URLS_PER_SITEMAP: 50000,        // Google/Bing limit
  RECOMMENDED_URLS_PER_SITEMAP: 10000, // Our conservative limit
  MAX_FILE_SIZE_MB: 50,               // Uncompressed limit
  MAX_SITEMAPS_IN_INDEX: 50000        // Sitemap index limit
}

/**
 * Calculate sitemap structure and validate against limits
 */
async function calculateSitemapStructure() {
  try {
    console.log('📊 Calculating sitemap structure...')
    
    // Get total contractor count
    const contractorResult = await executeQuery(`
      SELECT COUNT(*) as total_count 
      FROM contractors 
      WHERE business_name IS NOT NULL 
        AND city IS NOT NULL
        AND (primary_status = 'Active' OR primary_status = 'Current')
    `)
    
    const totalContractors = parseInt(contractorResult.rows[0].total_count)
    const contractorSitemaps = Math.ceil(totalContractors / SITEMAP_LIMITS.RECOMMENDED_URLS_PER_SITEMAP)
    
    // Calculate static pages (estimated)
    const staticPagesCount = 8 + 1000 + 200 // Core pages + cities + categories
    const totalStaticSitemaps = 1 // All static pages in one sitemap
    
    const totalSitemaps = contractorSitemaps + totalStaticSitemaps
    const totalUrls = totalContractors + staticPagesCount
    
    const structure = {
      totalUrls,
      totalContractors,
      staticPagesCount,
      contractorSitemaps,
      totalStaticSitemaps,
      totalSitemaps,
      urlsPerSitemap: SITEMAP_LIMITS.RECOMMENDED_URLS_PER_SITEMAP,
      compliance: {
        urlsPerSitemapOk: SITEMAP_LIMITS.RECOMMENDED_URLS_PER_SITEMAP <= SITEMAP_LIMITS.MAX_URLS_PER_SITEMAP,
        totalSitemapsOk: totalSitemaps <= SITEMAP_LIMITS.MAX_SITEMAPS_IN_INDEX,
        estimatedFileSizeOk: true // Will validate actual size during generation
      }
    }
    
    console.log('📈 Sitemap Structure Analysis:')
    console.log(`   Total URLs: ${totalUrls.toLocaleString()}`)
    console.log(`   Contractor URLs: ${totalContractors.toLocaleString()}`)
    console.log(`   Static/Category URLs: ${staticPagesCount.toLocaleString()}`)
    console.log(`   Total Sitemaps: ${totalSitemaps}`)
    console.log(`   URLs per Sitemap: ${SITEMAP_LIMITS.RECOMMENDED_URLS_PER_SITEMAP.toLocaleString()}`)
    console.log(`   Compliance Status: ${structure.compliance.urlsPerSitemapOk && structure.compliance.totalSitemapsOk ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}`)
    
    return structure
    
  } catch (error) {
    console.error('❌ Error calculating sitemap structure:', error)
    throw error
  }
}

/**
 * Validate individual sitemap file size and URL count
 */
async function validateSitemapFile(sitemapUrl) {
  try {
    const response = await fetch(sitemapUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const content = await response.text()
    const fileSizeBytes = Buffer.byteLength(content, 'utf8')
    const fileSizeMB = fileSizeBytes / (1024 * 1024)
    
    // Count URLs in sitemap
    const urlMatches = content.match(/<url>/g)
    const urlCount = urlMatches ? urlMatches.length : 0
    
    const validation = {
      url: sitemapUrl,
      fileSizeBytes,
      fileSizeMB: fileSizeMB.toFixed(2),
      urlCount,
      compliance: {
        fileSizeOk: fileSizeMB <= SITEMAP_LIMITS.MAX_FILE_SIZE_MB,
        urlCountOk: urlCount <= SITEMAP_LIMITS.MAX_URLS_PER_SITEMAP,
        xmlValid: content.includes('<?xml') && content.includes('<urlset')
      }
    }
    
    console.log(`📄 ${sitemapUrl}:`)
    console.log(`   Size: ${validation.fileSizeMB}MB (${validation.fileSizeBytes.toLocaleString()} bytes)`)
    console.log(`   URLs: ${validation.urlCount.toLocaleString()}`)
    console.log(`   Status: ${Object.values(validation.compliance).every(Boolean) ? '✅ Valid' : '❌ Invalid'}`)
    
    return validation
    
  } catch (error) {
    console.error(`❌ Error validating ${sitemapUrl}:`, error.message)
    return {
      url: sitemapUrl,
      error: error.message,
      compliance: { fileSizeOk: false, urlCountOk: false, xmlValid: false }
    }
  }
}

/**
 * Performance monitoring for database queries
 */
async function monitorDatabasePerformance() {
  console.log('🔍 Monitoring database performance...')
  
  const tests = [
    {
      name: 'Total contractor count',
      query: `SELECT COUNT(*) FROM contractors WHERE business_name IS NOT NULL`
    },
    {
      name: 'Paginated contractor query (page 1)',
      query: `
        SELECT license_no, business_name, city, expiration_date 
        FROM contractors 
        WHERE business_name IS NOT NULL 
          AND city IS NOT NULL
          AND (primary_status = 'Active' OR primary_status = 'Current')
        ORDER BY license_no 
        LIMIT 10000 OFFSET 0
      `
    },
    {
      name: 'City aggregation query',
      query: `
        SELECT city, COUNT(*) as count 
        FROM contractors 
        WHERE city IS NOT NULL 
        GROUP BY city 
        ORDER BY count DESC 
        LIMIT 100
      `
    }
  ]
  
  for (const test of tests) {
    const startTime = Date.now()
    try {
      const result = await executeQuery(test.query)
      const duration = Date.now() - startTime
      console.log(`   ✅ ${test.name}: ${duration}ms (${result.rows.length} rows)`)
    } catch (error) {
      console.log(`   ❌ ${test.name}: Failed - ${error.message}`)
    }
  }
}

/**
 * Generate sitemap health report
 */
async function generateHealthReport() {
  console.log('🏥 Generating Sitemap Health Report...')
  console.log('=' .repeat(50))
  
  const structure = await calculateSitemapStructure()
  await monitorDatabasePerformance()
  
  console.log('=' .repeat(50))
  console.log('📋 Recommendations:')
  
  if (structure.totalUrls > 1000000) {
    console.log('   ⚠️  Consider implementing sitemap compression (gzip)')
  }
  
  if (structure.contractorSitemaps > 100) {
    console.log('   ⚠️  Consider implementing sitemap caching strategy')
  }
  
  console.log('   ✅ Use database indexes on: license_no, business_name, city, primary_status')
  console.log('   ✅ Implement HTTP caching headers (1-24 hours)')
  console.log('   ✅ Monitor sitemap generation performance daily')
  console.log('   ✅ Set up sitemap validation in CI/CD pipeline')
  
  return structure
}

// Export functions for use in other scripts
module.exports = {
  SITEMAP_LIMITS,
  calculateSitemapStructure,
  validateSitemapFile,
  monitorDatabasePerformance,
  generateHealthReport
}

// Run health report if called directly
if (require.main === module) {
  generateHealthReport()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Health report failed:', error)
      process.exit(1)
    })
}