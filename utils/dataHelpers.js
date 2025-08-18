// Utility functions to handle data differences between Oracle SQLite and Neon PostgreSQL

export const sanitizeContractor = (contractor) => {
  if (!contractor) return null

  return {
    ...contractor,
    // Ensure dates are consistently formatted
    expiration_date: contractor.expiration_date ? String(contractor.expiration_date).split('T')[0] : null,
    issue_date: contractor.issue_date ? String(contractor.issue_date).split('T')[0] : null,
    reissue_date: contractor.reissue_date ? String(contractor.reissue_date).split('T')[0] : null,
    wc_effective_date: contractor.wc_effective_date ? String(contractor.wc_effective_date).split('T')[0] : null,
    wc_expiration_date: contractor.wc_expiration_date ? String(contractor.wc_expiration_date).split('T')[0] : null,
    cb_effective_date: contractor.cb_effective_date ? String(contractor.cb_effective_date).split('T')[0] : null,
    wb_effective_date: contractor.wb_effective_date ? String(contractor.wb_effective_date).split('T')[0] : null,
    db_effective_date: contractor.db_effective_date ? String(contractor.db_effective_date).split('T')[0] : null,
    
    // Ensure strings are not null/undefined
    business_name: contractor.business_name || '',
    business_phone: contractor.business_phone || '',
    mailing_address: contractor.mailing_address || '',
    city: contractor.city || '',
    state: contractor.state || '',
    zip_code: contractor.zip_code || '',
    primary_status: contractor.primary_status || '',
    primary_classification: contractor.primary_classification || '',
    trade: contractor.trade || '',
    
    // Ensure numbers are properly typed
    cb_amount: contractor.cb_amount ? Number(contractor.cb_amount) : null,
    wb_amount: contractor.wb_amount ? Number(contractor.wb_amount) : null,
    db_amount: contractor.db_amount ? Number(contractor.db_amount) : null,
    
    // Ensure license number is a string
    license_no: String(contractor.license_no || ''),
    
    // Handle potential null values that should be empty strings
    county: contractor.county || '',
    country: contractor.country || '',
    business_type: contractor.business_type || ''
  }
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    // Handle different date formats from SQLite vs PostgreSQL
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.warn('Date formatting error:', error)
    return 'Invalid Date'
  }
}

export const formatCurrency = (amount) => {
  if (!amount || amount === 0) return 'N/A'
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(amount))
  } catch (error) {
    console.warn('Currency formatting error:', error)
    return `$${amount}`
  }
}

export const formatPhone = (phone) => {
  if (!phone) return 'N/A'
  
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  return phone // Return as-is if not standard format
}

export const safeString = (value, fallback = 'N/A') => {
  if (value === null || value === undefined || value === '') {
    return fallback
  }
  return String(value)
}