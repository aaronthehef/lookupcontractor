const { executeQuery } = require('../../lib/database.js')

// Copy the parseSmartSearch function from search.ts for testing
function parseSmartSearch(searchTerm, startParamIndex) {
  const conditions = []
  const params = []
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
        raw_classifications ILIKE $${paramIndex + 1} OR
        classification_codes ILIKE $${paramIndex + 2} OR
        trade ILIKE $${paramIndex + 3}
      )`)
      params.push(tradePattern.classification)
      params.push(`%${tradePattern.classification}%`)
      params.push(`%${tradePattern.classification}%`)
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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const searchTerm = "plumbers in Los Angeles"
    console.log('=== SMART SEARCH DEBUG ===')
    console.log('Original search term:', searchTerm)
    
    // Parse the search
    const parsed = parseSmartSearch(searchTerm, 1)
    console.log('Parsed conditions:', parsed.conditions)
    console.log('Parsed params:', parsed.params)
    
    // Build the full query like search.ts does
    const baseConditions = [
      `state = 'CA'`,
      `(primary_status IN ('CLEAR', 'ACTIVE') OR primary_status IS NULL)`
    ]
    
    const allConditions = baseConditions.concat(parsed.conditions)
    
    const countQuery = `
      SELECT COUNT(*) as total
      FROM contractors 
      WHERE ${allConditions.join(' AND ')}
    `
    
    console.log('Generated count query:', countQuery)
    console.log('With params:', parsed.params)
    
    // Test the count query
    const countResult = await executeQuery(countQuery, parsed.params)
    const total = countResult ? parseInt(countResult.rows[0].total) : 0
    
    // Get a few sample results
    const sampleQuery = `
      SELECT license_no, business_name, city, primary_classification, trade
      FROM contractors 
      WHERE ${allConditions.join(' AND ')}
      LIMIT 5
    `
    
    const sampleResult = await executeQuery(sampleQuery, parsed.params)

    return res.status(200).json({
      success: true,
      searchTerm,
      parsing: {
        conditions: parsed.conditions,
        params: parsed.params
      },
      query: {
        count: countQuery,
        sample: sampleQuery,
        params: parsed.params
      },
      results: {
        total,
        sample: sampleResult.rows || []
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Smart search debug error:', error)
    return res.status(500).json({ 
      error: 'Smart search debug failed',
      details: error.message
    })
  }
}