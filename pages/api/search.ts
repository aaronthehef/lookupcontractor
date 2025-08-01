import { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../lib/database.js'
import monitor from '../../lib/performance.js'
import cache from '../../lib/cache.js'

// Parse natural language search queries
function parseSmartSearch(searchTerm: string, startParamIndex: number): { conditions: string[], params: string[] } {
  const conditions: string[] = []
  const params: string[] = []
  let paramIndex = startParamIndex
  
  const term = searchTerm.toLowerCase().trim()
  
  // Trade/classification patterns
  const tradePatterns = [
    { pattern: /(electrician|electrical|electric)/g, classification: 'C-10', trade: 'Electrical' },
    { pattern: /(plumber|plumbing)/g, classification: 'C-36', trade: 'Plumbing' },
    { pattern: /(roofer|roofing)/g, classification: 'C-39', trade: 'Roofing' },
    { pattern: /(painter|painting)/g, classification: 'C-33', trade: 'Painting and Decorating' },
    { pattern: /(hvac|heating|cooling|air conditioning)/g, classification: 'C-20', trade: 'Warm-Air Heating, Ventilation, and A/C' },
    { pattern: /(landscap|garden|lawn)/g, classification: 'C-27', trade: 'Landscaping' },
    { pattern: /(floor|flooring|carpet)/g, classification: 'C-15', trade: 'Flooring and Floor Covering' },
    { pattern: /(concrete|cement)/g, classification: 'C-8', trade: 'Concrete' },
    { pattern: /(drywall|sheetrock)/g, classification: 'C-9', trade: 'Drywall' },
    { pattern: /(cabinet|millwork|finish carp)/g, classification: 'C-6', trade: 'Cabinet, Millwork and Finish Carpentry' },
    { pattern: /(general build|general contract|builder)/g, classification: 'B', trade: 'General Building Contractor' },
    { pattern: /(solar|photovoltaic|pv)/g, classification: 'C-46', trade: 'Solar' }
  ]
  
  // City extraction patterns
  const cityMatch = term.match(/(?:in|near|at|from)\s+([a-z\s]+)$/i)
  let extractedCity = null
  let searchTermWithoutCity = term
  
  if (cityMatch) {
    extractedCity = cityMatch[1].trim()
    searchTermWithoutCity = term.replace(cityMatch[0], '').trim()
  }
  
  // Check if it's a license number (digits only or starts with letter+digits)
  if (/^\d+$/.test(term) || /^[a-z]\d+$/i.test(term)) {
    conditions.push(`license_no ILIKE $${paramIndex}`)
    params.push(`%${term}%`)
    paramIndex++
  } else {
    // Look for trade patterns
    let foundTrade = false
    for (const tradePattern of tradePatterns) {
      if (tradePattern.pattern.test(searchTermWithoutCity)) {
        // For plumbing, include additional related terms
        if (tradePattern.classification === 'C-36') {
          conditions.push(`(
            primary_classification ILIKE $${paramIndex} OR 
            trade ILIKE $${paramIndex + 1} OR
            business_name ILIKE $${paramIndex + 2} OR
            raw_classifications ILIKE $${paramIndex + 3} OR
            business_name ILIKE $${paramIndex + 4} OR
            business_name ILIKE $${paramIndex + 5} OR
            business_name ILIKE $${paramIndex + 6} OR
            business_name ILIKE $${paramIndex + 7} OR
            business_name ILIKE $${paramIndex + 8}
          )`)
          params.push(`%${tradePattern.classification}%`)
          params.push(`%${tradePattern.trade}%`)
          params.push(`%${tradePattern.trade.toLowerCase()}%`)
          params.push(`%${tradePattern.classification}%`)
          params.push('%rooter%')
          params.push('%drain%')
          params.push('%sewer%')
          params.push('%pipe%')
          params.push('%water%')
          paramIndex += 9
        } else {
          conditions.push(`(
            primary_classification ILIKE $${paramIndex} OR 
            trade ILIKE $${paramIndex + 1} OR
            business_name ILIKE $${paramIndex + 2} OR
            raw_classifications ILIKE $${paramIndex + 3}
          )`)
          params.push(`%${tradePattern.classification}%`)
          params.push(`%${tradePattern.trade}%`)
          params.push(`%${tradePattern.trade.toLowerCase()}%`)
          params.push(`%${tradePattern.classification}%`)
          paramIndex += 4
        }
        foundTrade = true
        break
      }
    }
    
    // If no specific trade found, search business names
    if (!foundTrade) {
      conditions.push(`business_name ILIKE $${paramIndex}`)
      params.push(`%${searchTermWithoutCity}%`)
      paramIndex++
    }
  }
  
  // Add city filter if found
  if (extractedCity) {
    // Use exact match for better consistency with city browsing
    // Also normalize the city name to handle case variations
    conditions.push(`UPPER(TRIM(city)) = UPPER($${paramIndex})`)
    params.push(extractedCity.trim())
    paramIndex++
  }
  
  return { conditions, params }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = Date.now()
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { searchTerm, searchType, city, state, page = 1, limit = 50 } = req.body
  
  // Debug logging
  console.log('=== SEARCH DEBUG ===')
  console.log('Request body:', req.body)
  console.log('Search params:', { searchTerm, searchType, city, state, page, limit })

  if (!searchTerm || !searchType) {
    return res.status(400).json({ error: 'Missing search parameters' })
  }

  // Validate pagination parameters
  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(100, Math.max(10, parseInt(limit))) // Max 100, min 10
  const offset = (pageNum - 1) * limitNum

  // Generate cache key for search results
  const cacheKey = `search-${searchType}-${searchTerm}-${city || 'all'}-${state || 'all'}-${pageNum}-${limitNum}`
    .replace(/[^a-zA-Z0-9\-]/g, '_')
    .substring(0, 100)
  
  // Check cache first (only cache first page results to avoid memory issues)
  if (pageNum === 1) {
    const cachedResult = cache.get(cacheKey)
    if (cachedResult) {
      monitor.trackCacheHit()
      monitor.trackApiCall('/api/search', Date.now() - startTime, true)
      return res.status(200).json(cachedResult)
    }
  }

  try {

    // Build dynamic WHERE clause
    let whereConditions = [
      `state = 'CA'`,
      `(primary_status IN ('CLEAR', 'ACTIVE') OR primary_status IS NULL)`
    ]
    let queryParams: string[] = []
    let paramIndex = 1

    // Add search type specific condition
    switch (searchType) {
      case 'license':
        whereConditions.push(`license_no ILIKE $${paramIndex}`)
        queryParams.push(`%${searchTerm}%`)
        paramIndex++
        break

      case 'business':
        whereConditions.push(`business_name ILIKE $${paramIndex}`)
        queryParams.push(`%${searchTerm}%`)
        paramIndex++
        break

      case 'city':
        whereConditions.push(`city ILIKE $${paramIndex}`)
        queryParams.push(`%${searchTerm}%`)
        paramIndex++
        break

      case 'classification':
        whereConditions.push(`(
          primary_classification ILIKE $${paramIndex} OR 
          raw_classifications ILIKE $${paramIndex} OR
          trade ILIKE $${paramIndex}
        )`)
        queryParams.push(`%${searchTerm}%`)
        paramIndex++
        break

      case 'smart':
        // Parse natural language search
        const smartSearch = parseSmartSearch(searchTerm, paramIndex)
        whereConditions = whereConditions.concat(smartSearch.conditions)
        queryParams = queryParams.concat(smartSearch.params)
        paramIndex += smartSearch.params.length
        break

      default:
        return res.status(400).json({ error: 'Invalid search type' })
    }

    // Add city filter if provided and not already searching by city or using smart search
    if (city && searchType !== 'city' && searchType !== 'smart') {
      whereConditions.push(`city ILIKE $${paramIndex}`)
      queryParams.push(`%${city}%`)
      paramIndex++
    }

    // Add state filter if provided (currently only CA supported)
    if (state && state.toLowerCase() !== 'california') {
      // For now, only California is supported
      return res.status(400).json({ error: 'Only California contractors are currently available' })
    }

    // First, get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM contractors 
      WHERE ${whereConditions.join(' AND ')}
    `
    
    // Debug the generated query
    console.log('Generated count query:', countQuery)
    console.log('Query params:', queryParams)
    
    const countResult = await pool.query(countQuery, queryParams)
    const totalResults = parseInt(countResult.rows[0].total)
    
    console.log('Total results from count query:', totalResults)

    // Then get the paginated results
    const query = `
      SELECT id, license_no, business_name, city, county, zip_code,
             business_phone, primary_status, primary_classification, trade,
             issue_date, expiration_date, mailing_address
      FROM contractors 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${searchType === 'license' ? 'license_no' : 
                 searchType === 'classification' ? 'primary_classification, business_name' : 
                 'business_name'}
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `

    const { rows } = await pool.query(query, [...queryParams, limitNum, offset])

    const response = {
      contractors: rows,
      pagination: {
        currentPage: pageNum,
        limit: limitNum,
        total: totalResults,
        totalPages: Math.ceil(totalResults / limitNum),
        hasNext: pageNum < Math.ceil(totalResults / limitNum),
        hasPrev: pageNum > 1
      }
    }

    // Cache first page results for 10 minutes
    if (pageNum === 1 && totalResults > 0) {
      cache.set(cacheKey, response, 600000) // 10 minutes
      monitor.trackCacheMiss()
    }

    // Track successful API call
    monitor.trackApiCall('/api/search', Date.now() - startTime, true)
    
    res.status(200).json(response)

  } catch (error) {
    console.error('Database error:', error)
    
    // Track failed API call
    monitor.trackApiCall('/api/search', Date.now() - startTime, false)
    
    res.status(500).json({ error: 'Database search failed' })
  }
}

