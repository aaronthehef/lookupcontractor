import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function analyzeMissingClassifications() {
  console.log('🔍 Analyzing database for missing classifications...');
  
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    // 1. Find records with raw_classifications but no primary_classification
    console.log('\n📊 Records with raw_classifications but missing primary_classification:');
    const { rows: missingPrimary } = await client.query(`
      SELECT raw_classifications, COUNT(*) as count
      FROM contractors 
      WHERE raw_classifications IS NOT NULL 
        AND raw_classifications != ''
        AND (primary_classification IS NULL OR primary_classification = '')
      GROUP BY raw_classifications
      ORDER BY count DESC
      LIMIT 20
    `);
    
    missingPrimary.forEach(row => {
      console.log(`  "${row.raw_classifications}" - ${row.count} records`);
    });
    
    // 2. Find records with primary_classification but no trade
    console.log('\n📊 Records with primary_classification but missing trade:');
    const { rows: missingTrade } = await client.query(`
      SELECT primary_classification, COUNT(*) as count
      FROM contractors 
      WHERE primary_classification IS NOT NULL 
        AND primary_classification != ''
        AND (trade IS NULL OR trade = '')
      GROUP BY primary_classification
      ORDER BY count DESC
      LIMIT 20
    `);
    
    missingTrade.forEach(row => {
      console.log(`  "${row.primary_classification}" - ${row.count} records`);
    });
    
    // 3. Find unique raw_classifications to identify missing mappings
    console.log('\n📊 All unique raw_classifications (sample):');
    const { rows: uniqueRaw } = await client.query(`
      SELECT DISTINCT raw_classifications
      FROM contractors 
      WHERE raw_classifications IS NOT NULL 
        AND raw_classifications != ''
      ORDER BY raw_classifications
      LIMIT 50
    `);
    
    uniqueRaw.forEach(row => {
      console.log(`  "${row.raw_classifications}"`);
    });
    
    // 4. Find records with NULL classifications
    console.log('\n📊 Summary statistics:');
    const { rows: summary } = await client.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(raw_classifications) as has_raw_classifications,
        COUNT(primary_classification) as has_primary_classification,
        COUNT(trade) as has_trade,
        COUNT(*) - COUNT(raw_classifications) as missing_raw,
        COUNT(*) - COUNT(primary_classification) as missing_primary,
        COUNT(*) - COUNT(trade) as missing_trade
      FROM contractors
    `);
    
    const stats = summary[0];
    console.log(`  Total records: ${stats.total_records}`);
    console.log(`  Has raw_classifications: ${stats.has_raw_classifications}`);
    console.log(`  Has primary_classification: ${stats.has_primary_classification}`);
    console.log(`  Has trade: ${stats.has_trade}`);
    console.log(`  Missing raw_classifications: ${stats.missing_raw}`);
    console.log(`  Missing primary_classification: ${stats.missing_primary}`);
    console.log(`  Missing trade: ${stats.missing_trade}`);
    
    // 5. Find problematic classification patterns
    console.log('\n📊 Complex classification patterns that might need attention:');
    const { rows: complex } = await client.query(`
      SELECT raw_classifications, primary_classification, trade, COUNT(*) as count
      FROM contractors 
      WHERE raw_classifications IS NOT NULL 
        AND raw_classifications != ''
        AND (
          raw_classifications LIKE '%|%' OR 
          raw_classifications LIKE '% %' OR
          raw_classifications LIKE '%,%' OR
          raw_classifications LIKE '%;%'
        )
      GROUP BY raw_classifications, primary_classification, trade
      ORDER BY count DESC
      LIMIT 15
    `);
    
    complex.forEach(row => {
      console.log(`  Raw: "${row.raw_classifications}" -> Primary: "${row.primary_classification}" -> Trade: "${row.trade}" (${row.count} records)`);
    });
    
  } finally {
    await client.end();
  }
}

analyzeMissingClassifications().catch(console.error);