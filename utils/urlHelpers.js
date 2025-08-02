// URL slug generation utilities

export const createSlug = (text) => {
  if (!text) return 'unknown'
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    // Limit length
    .substring(0, 100)
}

export const createContractorSlug = (contractor) => {
  if (!contractor) return null
  
  const city = createSlug(contractor.city || 'unknown-city')
  const trade = createSlug(contractor.trade || contractor.primary_classification || 'general-contractor')
  const license = contractor.license_no || 'unknown'
  const businessName = createSlug(contractor.business_name || 'contractor')
  
  return {
    city,
    trade,
    license,
    businessName,
    fullPath: `/contractor/${city}/${trade}/${license}-${businessName}`
  }
}

// Helper function to create SEO-friendly contractor URLs
export const createContractorUrl = (contractor) => {
  if (!contractor) return '#'
  
  const slug = createContractorSlug(contractor)
  return slug ? slug.fullPath : `/contractor/${contractor.license_no || 'unknown'}`
}

export const parseContractorUrl = (city, trade, licenseAndName) => {
  if (!licenseAndName) return null
  
  // Split on the first hyphen to separate license from business name
  const hyphenIndex = licenseAndName.indexOf('-')
  if (hyphenIndex === -1) {
    // No hyphen found, treat entire string as license
    return { license: licenseAndName, businessName: null }
  }
  
  const license = licenseAndName.substring(0, hyphenIndex)
  const businessName = licenseAndName.substring(hyphenIndex + 1)
  
  return { license, businessName }
}

// CommonJS exports for compatibility with Node.js API routes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createSlug,
    createContractorSlug,
    createContractorUrl,
    parseContractorUrl
  }
}