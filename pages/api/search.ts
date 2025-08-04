import { NextApiRequest, NextApiResponse } from 'next'
import { pool, executeQuery } from '../../lib/database.js'
import monitor from '../../lib/performance.js'
import cache from '../../lib/cache.js'

// Parse natural language search queries
function parseSmartSearch(searchTerm: string, startParamIndex: number): { conditions: string[], params: string[] } {
  const conditions: string[] = []
  const params: string[] = []
  let paramIndex = startParamIndex
  
  const originalTerm = searchTerm.trim()
  const term = originalTerm.toLowerCase()
  
  // City extraction patterns
  let extractedCity = null
  let searchTermWithoutCity = originalTerm
  
  // Pattern 1: "plumber in los angeles" format
  const cityMatchWithPrep = term.match(/(?:in|near|at|from)\s+([a-z\s]+)$/i)
  if (cityMatchWithPrep) {
    extractedCity = cityMatchWithPrep[1].trim()
    searchTermWithoutCity = originalTerm.replace(cityMatchWithPrep[0], '').trim()
  } else {
    // Pattern 2: "los angeles plumber" format - check if first words match known cities
    const knownCities = [
      'los angeles', 'san francisco', 'san diego', 'sacramento', 'fresno', 'long beach',
      'oakland', 'bakersfield', 'stockton', 'fremont', 'san jose', 'irvine', 'chula vista',
      'riverside', 'santa ana', 'anaheim', 'modesto', 'huntington beach', 'glendale',
      'oxnard', 'fontana', 'moreno valley', 'santa clarita', 'oceanside', 'garden grove',
      'santa rosa', 'elk grove', 'corona', 'lancaster', 'palmdale', 'salinas', 'hayward',
      'pomona', 'escondido', 'torrance', 'sunnyvale', 'orange', 'fullerton', 'pasadena',
      'thousand oaks', 'visalia', 'simi valley', 'concord', 'roseville', 'santa clara',
      'vallejo', 'victorville', 'el monte', 'berkeley', 'downey', 'costa mesa', 'inglewood'
    ]
    
    // Sort by length (longest first) to match "los angeles" before "los"
    const sortedCities = knownCities.sort((a, b) => b.length - a.length)
    
    for (const city of sortedCities) {
      if (term.startsWith(city.toLowerCase() + ' ')) {
        extractedCity = city
        searchTermWithoutCity = originalTerm.substring(city.length).trim()
        break
      }
    }
    
    // If no city found at start, check if city appears at the end (e.g., "plumber irvine")
    if (!extractedCity) {
      for (const city of sortedCities) {
        if (term.endsWith(' ' + city.toLowerCase())) {
          extractedCity = city
          searchTermWithoutCity = originalTerm.substring(0, originalTerm.length - city.length).trim()
          break
        }
      }
    }
  }
  
  // Check if it's a license number (digits only or starts with letter+digits)
  if (/^\d+$/.test(searchTermWithoutCity) || /^[a-z]\d+$/i.test(searchTermWithoutCity)) {
    conditions.push(`license_no ILIKE $${paramIndex}`)
    params.push(`%${searchTermWithoutCity}%`)
    paramIndex++
    return { conditions, params }
  }
  
  // Split search term into words
  const words = searchTermWithoutCity.toLowerCase().split(/\s+/).filter(word => word.length > 0)
  
  // If we have multiple words, prioritize exact business name matches
  if (words.length > 1) {
    // First priority: Exact business name match
    conditions.push(`business_name ILIKE $${paramIndex}`)
    params.push(`%${searchTermWithoutCity}%`)
    paramIndex++
    
    // Add city filter if found
    if (extractedCity) {
      conditions.push(`UPPER(TRIM(city)) = UPPER($${paramIndex})`)
      params.push(extractedCity.trim())
      paramIndex++
    }
    
    return { conditions, params }
  }
  
  // Check for trade patterns (works for both single words and multi-word searches)
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
  
  // Look for trade patterns in the search term (regardless of number of words)
  let foundTrade = false
  for (const tradePattern of tradePatterns) {
    if (tradePattern.pattern.test(searchTermWithoutCity)) {
      // If we found a trade pattern, search by classification/trade using exact and pattern matching
      conditions.push(`(
        primary_classification = $${paramIndex} OR 
        raw_classifications ~ $${paramIndex + 1} OR
        classification_codes ~ $${paramIndex + 2} OR
        trade ILIKE $${paramIndex + 3}
      )`)
      params.push(tradePattern.classification)
      params.push(`\\b${tradePattern.classification}\\b`)
      params.push(`\\b${tradePattern.classification}\\b`)
      params.push(`%${tradePattern.trade}%`)
      paramIndex += 4
      foundTrade = true
      break
    }
  }
  
  // If no trade found, search business names and license numbers
  if (!foundTrade) {
    conditions.push(`(
      business_name ILIKE $${paramIndex} OR
      license_no ILIKE $${paramIndex + 1}
    )`)
    params.push(`%${searchTermWithoutCity}%`)
    params.push(`%${searchTermWithoutCity}%`)
    paramIndex += 2
  }
  
  // Add city filter if found
  if (extractedCity) {
    conditions.push(`UPPER(TRIM(city)) = UPPER($${paramIndex})`)
    params.push(extractedCity.trim())
    paramIndex++
  }
  
  return { conditions, params }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = Date.now()
  
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Contractor Search API',
      description: 'This endpoint accepts POST requests for contractor searches',
      usage: 'POST /api/search with body: { searchTerm, city, state, page, limit }'
    })
  }
  
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
  const limitNum = Math.min(10000, Math.max(10, parseInt(limit))) // Max 10000, min 10
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
        // Search for contractors with the classification as primary OR in their raw classifications
        // Use exact matching and word boundaries to avoid partial matches
        whereConditions.push(`(
          primary_classification = $${paramIndex} OR 
          raw_classifications ~ $${paramIndex + 1} OR
          classification_codes ~ $${paramIndex + 2}
        )`)
        queryParams.push(searchTerm.toUpperCase())
        queryParams.push(`\\b${searchTerm.toUpperCase()}\\b`)
        queryParams.push(`\\b${searchTerm.toUpperCase()}\\b`)
        paramIndex += 3
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
    
    const countResult = await executeQuery(countQuery, queryParams)
    const totalResults = countResult ? parseInt((countResult.rows[0] as any).total) : 0
    
    console.log('Total results from count query:', totalResults)

    // Then get the paginated results
    const query = `
      SELECT id, license_no, business_name, city, county, zip_code,
             business_phone, primary_status, primary_classification, trade,
             issue_date, expiration_date, mailing_address
      FROM contractors 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${searchType === 'license' ? 'license_no' : 
                 searchType === 'classification' ? 
                 `CASE 
                    WHEN primary_status = 'CLEAR' THEN 1 
                    WHEN primary_status = 'ACTIVE' THEN 2 
                    WHEN primary_status IS NULL THEN 3 
                    ELSE 4 
                  END, business_name` : 
                 `CASE 
                    WHEN primary_status = 'CLEAR' THEN 1 
                    WHEN primary_status = 'ACTIVE' THEN 2 
                    WHEN primary_status IS NULL THEN 3 
                    ELSE 4 
                  END, business_name`}
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `

    const result = await executeQuery(query, [...queryParams, limitNum, offset])
    const rows = result?.rows || []

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

