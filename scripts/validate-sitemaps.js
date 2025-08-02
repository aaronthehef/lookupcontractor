const { validateSitemapFile } = require('./sitemap-utils.js')

/**
 * Comprehensive sitemap validation for production deployment
 * Tests actual live sitemaps against Google/Bing requirements
 */

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.lookupcontractor.com'
  : 'http://localhost:3000'

async function validateAllSitemaps() {
  console.log('🔍 Validating all sitemaps...')
  console.log(`Base URL: ${BASE_URL}`)
  console.log('=' .repeat(60))
  
  const results = []
  let totalErrors = 0
  
  try {
    // 1. Validate sitemap index
    console.log('📂 Validating Sitemap Index...')
    const indexResult = await validateSitemapFile(`${BASE_URL}/api/sitemap-index.xml`)
    results.push(indexResult)
    
    if (indexResult.error) {
      totalErrors++
      console.log('❌ Sitemap index validation failed!')
      return
    }
    
    // 2. Validate pages sitemap
    console.log('\n📄 Validating Pages Sitemap...')
    const pagesResult = await validateSitemapFile(`${BASE_URL}/api/sitemap-pages.xml`)
    results.push(pagesResult)
    if (pagesResult.error) totalErrors++
    
    // 3. Test sample contractor sitemaps
    console.log('\n👷 Validating Sample Contractor Sitemaps...')
    const samplePages = [1, 5, 10, 25] // Test representative pages
    
    for (const page of samplePages) {
      const contractorResult = await validateSitemapFile(`${BASE_URL}/api/sitemap-contractors-${page}.xml`)
      results.push(contractorResult)
      if (contractorResult.error) totalErrors++
    }
    
    // 4. Generate summary report
    console.log('\n📊 Validation Summary:')
    console.log('=' .repeat(60))
    
    const validSitemaps = results.filter(r => !r.error && Object.values(r.compliance || {}).every(Boolean))
    const invalidSitemaps = results.filter(r => r.error || !Object.values(r.compliance || {}).every(Boolean))
    
    console.log(`✅ Valid sitemaps: ${validSitemaps.length}`)
    console.log(`❌ Invalid sitemaps: ${invalidSitemaps.length}`)
    
    if (invalidSitemaps.length > 0) {
      console.log('\n🚨 Issues found:')
      invalidSitemaps.forEach(sitemap => {
        console.log(`   ${sitemap.url}: ${sitemap.error || 'Compliance issues'}`)
        if (sitemap.compliance) {
          Object.entries(sitemap.compliance).forEach(([key, value]) => {
            if (!value) console.log(`      - ${key}: FAILED`)
          })
        }
      })
    }
    
    const totalSize = results.reduce((sum, r) => sum + (r.fileSizeBytes || 0), 0)
    const totalUrls = results.reduce((sum, r) => sum + (r.urlCount || 0), 0)
    
    console.log(`\n📈 Total validated:`)
    console.log(`   Files: ${results.length}`)
    console.log(`   URLs: ${totalUrls.toLocaleString()}`)
    console.log(`   Size: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`)
    
    // 5. Performance recommendations
    console.log('\n💡 Performance Notes:')
    if (totalSize > 10 * 1024 * 1024) { // > 10MB total
      console.log('   ⚠️  Consider implementing gzip compression')
    }
    if (results.some(r => r.fileSizeMB > 5)) {
      console.log('   ⚠️  Some sitemaps are large - monitor generation time')
    }
    console.log('   ✅ Add Cache-Control headers for better performance')
    console.log('   ✅ Monitor sitemap access patterns in analytics')
    
    return totalErrors === 0
    
  } catch (error) {
    console.error('❌ Validation failed:', error)
    return false
  }
}

// Test specific sitemap types
async function quickValidation() {
  console.log('⚡ Quick Validation Test...')
  
  const testUrls = [
    `${BASE_URL}/api/sitemap-index.xml`,
    `${BASE_URL}/api/sitemap-pages.xml`,
    `${BASE_URL}/api/sitemap-contractors-1.xml`
  ]
  
  for (const url of testUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      const status = response.ok ? '✅' : '❌'
      console.log(`   ${status} ${url} (${response.status})`)
    } catch (error) {
      console.log(`   ❌ ${url} (${error.message})`)
    }
  }
}

// Run validation based on command line arguments
async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--quick')) {
    await quickValidation()
  } else {
    const success = await validateAllSitemaps()
    process.exit(success ? 0 : 1)
  }
}

// Export for use in other scripts
module.exports = {
  validateAllSitemaps,
  quickValidation
}

// Run if called directly
if (require.main === module) {
  main()
}