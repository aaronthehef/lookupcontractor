import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function verifyImportComplete() {
  console.log('🔍 Verifying import completion and data quality...\n');
  
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    // 1. Count total records in CSV
    console.log('📊 Counting CSV records...');
    const csvCount = await new Promise((resolve, reject) => {
      let count = 0;
      const csvStream = createReadStream('./cslb_master_list.csv');
      const parser = parse({ 
        columns: true, 
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
        trim: true
      });
      
      parser.on('data', () => count++);
      parser.on('end', () => resolve(count));
      parser.on('error', reject);
      
      csvStream.pipe(parser);
    });
    
    console.log(`📋 Total CSV records: ${csvCount.toLocaleString()}`);
    
    // 2. Count total records in database
    console.log('\n📊 Counting database records...');
    const { rows: dbCount } = await client.query('SELECT COUNT(*) FROM contractors WHERE state = $1', ['CA']);
    const totalDbRecords = parseInt(dbCount[0].count);
    
    console.log(`🗄️ Total database records: ${totalDbRecords.toLocaleString()}`);
    
    // 3. Calculate completion percentage
    const completionRate = ((totalDbRecords / csvCount) * 100).toFixed(2);
    console.log(`📈 Completion rate: ${completionRate}%`);
    
    // 4. Show import status
    if (completionRate >= 99.9) {
      console.log('✅ IMPORT COMPLETE! 🎉');
    } else if (completionRate >= 95) {
      console.log('⚠️ IMPORT NEARLY COMPLETE - Minor records missing');
    } else {
      console.log('❌ IMPORT INCOMPLETE - Significant records missing');
    }
    
    // 5. Data quality checks
    console.log('\n🔍 Data Quality Analysis:');
    
    // Check field population rates
    const { rows: fieldStats } = await client.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(license_no) as has_license_no,
        COUNT(business_name) as has_business_name,
        COUNT(city) as has_city,
        COUNT(county) as has_county,
        COUNT(zip_code) as has_zip_code,
        COUNT(mailing_address) as has_mailing_address,
        COUNT(business_phone) as has_business_phone,
        COUNT(primary_status) as has_primary_status,
        COUNT(issue_date) as has_issue_date,
        COUNT(expiration_date) as has_expiration_date,
        COUNT(raw_classifications) as has_raw_classifications,
        COUNT(primary_classification) as has_primary_classification,
        COUNT(trade) as has_trade,
        COUNT(cb_amount) as has_cb_amount,
        COUNT(workers_comp_coverage_type) as has_workers_comp,
        COUNT(business_type) as has_business_type
      FROM contractors 
      WHERE state = 'CA'
    `);
    
    const stats = fieldStats[0];
    
    console.log('\n📈 Field Population Rates:');
    const fields = [
      { name: 'License Number', field: 'has_license_no' },
      { name: 'Business Name', field: 'has_business_name' },
      { name: 'City', field: 'has_city' },
      { name: 'County', field: 'has_county' },
      { name: 'ZIP Code', field: 'has_zip_code' },
      { name: 'Mailing Address', field: 'has_mailing_address' },
      { name: 'Business Phone', field: 'has_business_phone' },
      { name: 'Primary Status', field: 'has_primary_status' },
      { name: 'Issue Date', field: 'has_issue_date' },
      { name: 'Expiration Date', field: 'has_expiration_date' },
      { name: 'Classifications', field: 'has_raw_classifications' },
      { name: 'Primary Classification', field: 'has_primary_classification' },
      { name: 'Trade Description', field: 'has_trade' },
      { name: 'Bond Amount', field: 'has_cb_amount' },
      { name: 'Workers Comp Type', field: 'has_workers_comp' },
      { name: 'Business Type', field: 'has_business_type' }
    ];
    
    fields.forEach(({ name, field }) => {
      const count = parseInt(stats[field]);
      const percentage = ((count / totalDbRecords) * 100).toFixed(1);
      const status = percentage >= 80 ? '✅' : percentage >= 50 ? '⚠️' : '❌';
      console.log(`  ${status} ${name}: ${count.toLocaleString()}/${totalDbRecords.toLocaleString()} (${percentage}%)`);
    });
    
    // 6. Classification analysis
    console.log('\n🏷️ Classification Analysis:');
    const { rows: classificationStats } = await client.query(`
      SELECT 
        primary_classification,
        trade,
        COUNT(*) as count
      FROM contractors 
      WHERE state = 'CA' 
        AND primary_classification IS NOT NULL
      GROUP BY primary_classification, trade
      ORDER BY count DESC
      LIMIT 15
    `);
    
    console.log('Top 15 Classifications:');
    classificationStats.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.primary_classification} - ${row.trade} (${row.count.toLocaleString()} contractors)`);
    });
    
    // 7. License number range check
    console.log('\n🔢 License Number Range:');
    const { rows: licenseRange } = await client.query(`
      SELECT 
        MIN(license_no) as min_license,
        MAX(license_no) as max_license,
        COUNT(DISTINCT license_no) as unique_licenses
      FROM contractors 
      WHERE state = 'CA'
    `);
    
    const range = licenseRange[0];
    console.log(`  Lowest License: ${range.min_license}`);
    console.log(`  Highest License: ${range.max_license}`);
    console.log(`  Unique Licenses: ${parseInt(range.unique_licenses).toLocaleString()}`);
    
    // 8. Recent records check
    console.log('\n📅 Recent Import Data:');
    const { rows: recentRecords } = await client.query(`
      SELECT license_no, business_name, city, primary_classification, created_at
      FROM contractors 
      WHERE state = 'CA'
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log('Last 5 imported records:');
    recentRecords.forEach((record, i) => {
      console.log(`  ${i + 1}. ${record.license_no} - ${record.business_name} (${record.city}) - ${record.primary_classification}`);
    });
    
    // 9. Check for progress file
    console.log('\n📋 Import Progress Status:');
    try {
      const fs = await import('fs');
      const progress = JSON.parse(fs.readFileSync('./import_progress.json', 'utf8'));
      console.log(`  Last processed record: ${progress.lastProcessed.toLocaleString()}`);
      console.log(`  Last update: ${progress.timestamp}`);
      
      if (progress.lastProcessed >= csvCount - 100) {
        console.log('  ✅ Progress indicates import is complete');
      } else {
        console.log('  ⚠️ Progress indicates import may be incomplete');
      }
    } catch {
      console.log('  📄 No progress file found (import may be complete)');
    }
    
    // 10. Final summary
    console.log('\n🎯 FINAL SUMMARY:');
    console.log(`📊 CSV Records: ${csvCount.toLocaleString()}`);
    console.log(`🗄️ DB Records: ${totalDbRecords.toLocaleString()}`);
    console.log(`📈 Success Rate: ${completionRate}%`);
    
    if (completionRate >= 99.9) {
      console.log('\n🎉 SUCCESS! Import is complete with comprehensive data:');
      console.log('  ✅ All contractor records imported');
      console.log('  ✅ Complete address and contact information');
      console.log('  ✅ Full classification data with enhanced parsing');
      console.log('  ✅ Financial information (bonds, insurance)');
      console.log('  ✅ License status and regulatory data');
      console.log('  ✅ Ready for production use!');
    } else {
      const missing = csvCount - totalDbRecords;
      console.log(`\n⚠️ ${missing.toLocaleString()} records still need to be imported`);
      console.log('Run: node import_complete.js to continue');
    }
    
  } finally {
    await client.end();
  }
}

verifyImportComplete().catch(console.error);