// Debug script to test smart search parsing
function parseSmartSearch(searchTerm, startParamIndex) {
  const conditions = []
  const params = []
  let paramIndex = startParamIndex
  
  const originalTerm = searchTerm.trim()
  const term = originalTerm.toLowerCase()
  
  console.log('=== DEBUGGING SMART SEARCH ===')
  console.log('Original term:', originalTerm)
  console.log('Lowercase term:', term)
  
  // City extraction patterns
  let extractedCity = null
  let searchTermWithoutCity = originalTerm
  
  // Pattern 1: "plumber in los angeles" format
  const cityMatchWithPrep = term.match(/(?:in|near|at|from)\s+([a-z\s]+)$/i)
  if (cityMatchWithPrep) {
    extractedCity = cityMatchWithPrep[1].trim()
    searchTermWithoutCity = originalTerm.replace(cityMatchWithPrep[0], '').trim()
    console.log('Pattern 1 matched - City:', extractedCity, 'Term without city:', searchTermWithoutCity)
  } else {
    console.log('Pattern 1 did not match')
    
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
      console.log(`Testing city "${city}" against term "${term}"`)
      if (term.startsWith(city.toLowerCase() + ' ')) {
        extractedCity = city
        searchTermWithoutCity = originalTerm.substring(city.length).trim()
        console.log('Pattern 2 matched - City:', extractedCity, 'Term without city:', searchTermWithoutCity)
        break
      }
    }
    
    if (!extractedCity) {
      console.log('Pattern 2 did not match any cities')
    }
  }
  
  console.log('Final extracted city:', extractedCity)
  console.log('Final search term without city:', searchTermWithoutCity)
  
  // Check if it's a license number (digits only or starts with letter+digits)
  if (/^\d+$/.test(searchTermWithoutCity) || /^[a-z]\d+$/i.test(searchTermWithoutCity)) {
    console.log('Detected as license number')
    conditions.push(`license_no ILIKE $${paramIndex}`)
    params.push(`%${searchTermWithoutCity}%`)
    paramIndex++
    return { conditions, params }
  }
  
  // Split search term into words
  const words = searchTermWithoutCity.toLowerCase().split(/\s+/).filter(word => word.length > 0)
  console.log('Words after splitting:', words)
  
  // If we have multiple words, prioritize exact business name matches
  if (words.length > 1) {
    console.log('Multiple words detected - searching business names')
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
  console.log('Testing trade patterns against:', searchTermWithoutCity)
  for (const tradePattern of tradePatterns) {
    console.log(`Testing pattern ${tradePattern.pattern} for classification ${tradePattern.classification}`)
    if (tradePattern.pattern.test(searchTermWithoutCity)) {
      console.log('Trade pattern matched!', tradePattern.classification)
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
    console.log('No trade pattern found - searching business names and license numbers')
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
    console.log('Adding city filter for:', extractedCity)
    conditions.push(`UPPER(TRIM(city)) = UPPER($${paramIndex})`)
    params.push(extractedCity.trim())
    paramIndex++
  }
  
  console.log('Final conditions:', conditions)
  console.log('Final params:', params)
  
  return { conditions, params }
}

// Test the failing searches
const testCases = [
  'hvac fresno',
  'plumber irvine',
  'general contractors irvine',
  'electrician san diego'
]

for (const testCase of testCases) {
  console.log('\n' + '='.repeat(50))
  console.log('TESTING:', testCase)
  console.log('='.repeat(50))
  const result = parseSmartSearch(testCase, 1)
  console.log('Result:', result)
}