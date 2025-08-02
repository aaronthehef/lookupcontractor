export function createSlug(text) {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 60) // Limit length
}

export function slugToCity(slug) {
  if (!slug) return ''
  
  return slug
    .replace(/-/g, ' ')
    .toUpperCase()
    .trim()
}

export function createContractorUrl(contractor) {
  if (!contractor) return '#'
  
  const slug = createSlug(contractor.business_name)
  return slug ? `/contractor/${contractor.license_no}/${slug}` : `/contractor/${contractor.license_no}`
}

export function parseContractorUrl(router) {
  const { license, slug } = router.query
  return {
    licenseNo: license,
    slug: slug || null
  }
}