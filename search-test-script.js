const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3001';

// Test data for comprehensive search testing
const TEST_CASES = {
  smartSearch: [
    "plumber irvine",
    "plumbers in bakersfield", 
    "electrician san diego",
    "electricians in los angeles",
    "roofers in sacramento",
    "hvac fresno",
    "hvac contractors in san jose",
    "general contractors irvine",
    "painting contractors bakersfield",
    "landscaping san diego"
  ],
  
  classificationSearch: [
    "B",      // General Building contractors
    "C-10",   // Electrical contractors
    "C-36",   // Plumbing contractors
    "C-20",   // HVAC contractors
    "C-39",   // Roofing contractors
    "A"       // General Engineering contractors
  ],
  
  citySearch: [
    "irvine",
    "bakersfield",
    "san diego", 
    "los angeles",
    "sacramento"
  ],
  
  tradeSearch: [
    "plumbers",
    "electricians",
    "roofers", 
    "general contractors",
    "landscapers"
  ]
};

// Function to perform a search API call
async function performSearch(searchTerm, searchType = 'smart', limit = 10) {
  try {
    const response = await fetch(`${BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchTerm: searchTerm,
        searchType: searchType,
        state: 'california',
        page: 1,
        limit: limit
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      searchTerm,
      searchType,
      resultCount: data.pagination?.total || 0,
      sampleResults: data.contractors?.slice(0, 3).map(c => ({
        name: c.business_name,
        license: c.license_no,
        city: c.city,
        classification: c.primary_classification,
        trade: c.trade
      })) || [],
      pagination: data.pagination,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      searchTerm,
      searchType,
      resultCount: 0,
      sampleResults: [],
      pagination: null,
      error: error.message
    };
  }
}

// Function to analyze and report results
function analyzeResults(results, expectedBehavior) {
  const issues = [];
  
  if (results.resultCount === 0) {
    issues.push("No results found - may indicate search problem");
  }
  
  if (results.sampleResults.length === 0 && results.resultCount > 0) {
    issues.push("Result count shows results but no sample contractors returned");
  }
  
  // Check if results match search criteria based on expected behavior
  if (expectedBehavior.shouldHaveCity) {
    const cityMatches = results.sampleResults.every(contractor => 
      contractor.city && contractor.city.toLowerCase().includes(expectedBehavior.expectedCity.toLowerCase())
    );
    if (!cityMatches && results.sampleResults.length > 0) {
      issues.push(`Expected results from ${expectedBehavior.expectedCity} but found contractors from other cities`);
    }
  }
  
  if (expectedBehavior.shouldHaveTrade) {
    const tradeMatches = results.sampleResults.some(contractor => 
      contractor.trade && contractor.trade.toLowerCase().includes(expectedBehavior.expectedTrade.toLowerCase())
    );
    if (!tradeMatches && results.sampleResults.length > 0) {
      issues.push(`Expected ${expectedBehavior.expectedTrade} contractors but found different trades`);
    }
  }
  
  return {
    ...results,
    issues,
    passesValidation: issues.length === 0
  };
}

// Main testing function
async function runAllTests() {
  console.log('🔍 COMPREHENSIVE CONTRACTOR SEARCH TESTING');
  console.log('==========================================\n');
  
  const allResults = {
    smartSearch: [],
    classificationSearch: [],
    citySearch: [],
    tradeSearch: [],
    businessNameSearch: [],
    licenseNumberSearch: []
  };

  // 1. Test Smart Search (Trade + City combinations)
  console.log('1. TESTING SMART SEARCH (Trade + City Combinations)');
  console.log('---------------------------------------------------');
  
  for (const searchTerm of TEST_CASES.smartSearch) {
    console.log(`Testing: "${searchTerm}"`);
    
    // Determine expected behavior based on search term
    const expectedBehavior = {
      shouldHaveCity: true,
      expectedCity: searchTerm.includes('irvine') ? 'irvine' :
                   searchTerm.includes('bakersfield') ? 'bakersfield' :
                   searchTerm.includes('san diego') ? 'san diego' :
                   searchTerm.includes('los angeles') ? 'los angeles' :
                   searchTerm.includes('sacramento') ? 'sacramento' :
                   searchTerm.includes('fresno') ? 'fresno' :
                   searchTerm.includes('san jose') ? 'san jose' : null,
      shouldHaveTrade: true,
      expectedTrade: searchTerm.includes('plumb') ? 'plumbing' :
                    searchTerm.includes('electric') ? 'electrical' :
                    searchTerm.includes('roof') ? 'roofing' :
                    searchTerm.includes('hvac') ? 'hvac' :
                    searchTerm.includes('general') ? 'general' :
                    searchTerm.includes('paint') ? 'painting' :
                    searchTerm.includes('landscap') ? 'landscaping' : null
    };
    
    const result = await performSearch(searchTerm, 'smart');
    const analysis = analyzeResults(result, expectedBehavior);
    allResults.smartSearch.push(analysis);
    
    console.log(`   Results: ${result.resultCount} contractors found`);
    if (result.sampleResults.length > 0) {
      console.log(`   Sample: ${result.sampleResults[0].name} (${result.sampleResults[0].city})`);
    }
    if (analysis.issues.length > 0) {
      console.log(`   ⚠️  Issues: ${analysis.issues.join(', ')}`);
    }
    console.log('');
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 2. Test Classification Code Searches
  console.log('2. TESTING CLASSIFICATION CODE SEARCHES');
  console.log('---------------------------------------');
  
  for (const classification of TEST_CASES.classificationSearch) {
    console.log(`Testing: "${classification}"`);
    
    const expectedBehavior = {
      shouldHaveClassification: true,
      expectedClassification: classification
    };
    
    const result = await performSearch(classification, 'classification');
    const analysis = analyzeResults(result, expectedBehavior);
    allResults.classificationSearch.push(analysis);
    
    console.log(`   Results: ${result.resultCount} contractors found`);
    if (result.sampleResults.length > 0) {
      console.log(`   Sample: ${result.sampleResults[0].name} (${result.sampleResults[0].classification})`);
    }
    if (analysis.issues.length > 0) {
      console.log(`   ⚠️  Issues: ${analysis.issues.join(', ')}`);
    }
    console.log('');
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 3. Test City-Only Searches
  console.log('3. TESTING CITY-ONLY SEARCHES');
  console.log('------------------------------');
  
  for (const city of TEST_CASES.citySearch) {
    console.log(`Testing: "${city}"`);
    
    const expectedBehavior = {
      shouldHaveCity: true,
      expectedCity: city
    };
    
    const result = await performSearch(city, 'city');
    const analysis = analyzeResults(result, expectedBehavior);
    allResults.citySearch.push(analysis);
    
    console.log(`   Results: ${result.resultCount} contractors found`);
    if (result.sampleResults.length > 0) {
      console.log(`   Sample: ${result.sampleResults[0].name} (${result.sampleResults[0].city})`);
    }
    if (analysis.issues.length > 0) {
      console.log(`   ⚠️  Issues: ${analysis.issues.join(', ')}`);
    }
    console.log('');
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 4. Test Trade-Only Searches (Statewide)
  console.log('4. TESTING TRADE-ONLY SEARCHES (Statewide)');
  console.log('-------------------------------------------');
  
  for (const trade of TEST_CASES.tradeSearch) {
    console.log(`Testing: "${trade}"`);
    
    const expectedBehavior = {
      shouldHaveTrade: true,
      expectedTrade: trade.replace('s', '') // Remove plural 's'
    };
    
    const result = await performSearch(trade, 'smart');
    const analysis = analyzeResults(result, expectedBehavior);
    allResults.tradeSearch.push(analysis);
    
    console.log(`   Results: ${result.resultCount} contractors found`);
    if (result.sampleResults.length > 0) {
      console.log(`   Sample: ${result.sampleResults[0].name} (${result.sampleResults[0].trade})`);
    }
    if (analysis.issues.length > 0) {
      console.log(`   ⚠️  Issues: ${analysis.issues.join(', ')}`);
    }
    console.log('');
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 5. Test Business Name Searches (using some sample results from previous searches)
  console.log('5. TESTING BUSINESS NAME SEARCHES');
  console.log('----------------------------------');
  
  // Get some business names from previous results to test with
  const sampleBusinessNames = [];
  for (const category in allResults) {
    for (const result of allResults[category]) {
      if (result.sampleResults.length > 0) {
        sampleBusinessNames.push(result.sampleResults[0].name);
        if (sampleBusinessNames.length >= 3) break;
      }
    }
    if (sampleBusinessNames.length >= 3) break;
  }
  
  for (const businessName of sampleBusinessNames) {
    if (!businessName) continue;
    
    console.log(`Testing: "${businessName}"`);
    
    const result = await performSearch(businessName, 'business');
    const analysis = analyzeResults(result, {});
    allResults.businessNameSearch.push(analysis);
    
    console.log(`   Results: ${result.resultCount} contractors found`);
    if (result.sampleResults.length > 0) {
      console.log(`   Sample: ${result.sampleResults[0].name}`);
    }
    if (analysis.issues.length > 0) {
      console.log(`   ⚠️  Issues: ${analysis.issues.join(', ')}`);
    }
    console.log('');
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 6. Test License Number Searches
  console.log('6. TESTING LICENSE NUMBER SEARCHES');
  console.log('-----------------------------------');
  
  // Get some license numbers from previous results to test with
  const sampleLicenseNumbers = [];
  for (const category in allResults) {
    for (const result of allResults[category]) {
      if (result.sampleResults.length > 0 && result.sampleResults[0].license) {
        sampleLicenseNumbers.push(result.sampleResults[0].license);
        if (sampleLicenseNumbers.length >= 3) break;
      }
    }
    if (sampleLicenseNumbers.length >= 3) break;
  }
  
  for (const licenseNumber of sampleLicenseNumbers) {
    if (!licenseNumber) continue;
    
    console.log(`Testing: "${licenseNumber}"`);
    
    const result = await performSearch(licenseNumber, 'license');
    const analysis = analyzeResults(result, {});
    allResults.licenseNumberSearch.push(analysis);
    
    console.log(`   Results: ${result.resultCount} contractors found`);
    if (result.sampleResults.length > 0) {
      console.log(`   Sample: ${result.sampleResults[0].name} (${result.sampleResults[0].license})`);
    }
    if (analysis.issues.length > 0) {
      console.log(`   ⚠️  Issues: ${analysis.issues.join(', ')}`);
    }
    console.log('');
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Generate Summary Report
  console.log('\n📊 SUMMARY REPORT');
  console.log('==================');
  
  const summary = {};
  let totalTests = 0;
  let totalPassed = 0;
  let totalIssues = 0;
  
  for (const [category, results] of Object.entries(allResults)) {
    const categoryPassed = results.filter(r => r.passesValidation).length;
    const categoryIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    
    summary[category] = {
      total: results.length,
      passed: categoryPassed,
      failed: results.length - categoryPassed,
      totalIssues: categoryIssues,
      avgResults: results.reduce((sum, r) => sum + r.resultCount, 0) / results.length || 0
    };
    
    totalTests += results.length;
    totalPassed += categoryPassed;
    totalIssues += categoryIssues;
    
    console.log(`\n${category.toUpperCase()}:`);
    console.log(`  Total Tests: ${summary[category].total}`);
    console.log(`  Passed: ${summary[category].passed}`);
    console.log(`  Failed: ${summary[category].failed}`);
    console.log(`  Issues Found: ${summary[category].totalIssues}`);
    console.log(`  Avg Results Per Search: ${Math.round(summary[category].avgResults)}`);
  }
  
  console.log(`\nOVERALL RESULTS:`);
  console.log(`  Total Tests Run: ${totalTests}`);
  console.log(`  Tests Passed: ${totalPassed} (${Math.round((totalPassed/totalTests)*100)}%)`);
  console.log(`  Tests Failed: ${totalTests - totalPassed}`);
  console.log(`  Total Issues Found: ${totalIssues}`);
  
  // Save detailed results to file
  const detailedReport = {
    testDate: new Date().toISOString(),
    summary,
    detailedResults: allResults
  };
  
  require('fs').writeFileSync('search-test-results.json', JSON.stringify(detailedReport, null, 2));
  console.log('\n📝 Detailed results saved to search-test-results.json');
}

// Run the tests
runAllTests().catch(console.error);