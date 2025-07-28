import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function compareColumns() {
  console.log('🔍 Comparing CSV columns with database fields...\n');
  
  // Get CSV headers
  console.log('📋 Getting CSV headers...');
  const csvHeaders = await new Promise((resolve, reject) => {
    const headers = [];
    const csvStream = createReadStream('./cslb_master_list.csv');
    const parser = parse({ columns: true, skip_empty_lines: true });
    
    parser.on('headers', (headerList) => {
      resolve(headerList);
    });
    
    parser.on('data', (row) => {
      if (headers.length === 0) {
        resolve(Object.keys(row));
      }
    });
    
    parser.on('error', reject);
    
    csvStream.pipe(parser);
  });
  
  console.log('📊 CSV Headers found:', csvHeaders.length);
  csvHeaders.forEach((header, i) => {
    console.log(`  ${i + 1}. ${header}`);
  });
  
  // Get database columns
  console.log('\n📋 Getting database columns...');
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    const { rows: dbColumns } = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'contractors' 
        AND column_name NOT IN ('id', 'created_at', 'updated_at')
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Database columns found:', dbColumns.length);
    dbColumns.forEach((col, i) => {
      console.log(`  ${i + 1}. ${col.column_name} (${col.data_type})`);
    });
    
    // Normalize headers for comparison
    function normalizeKey(key) {
      return key.toLowerCase()
        .replace(/[\s\(\)-]+/g, '')
        .replace(/_+/g, '')
        .replace(/^_+|_+$/g, '');
    }
    
    const normalizedCsvHeaders = csvHeaders.map(h => ({
      original: h,
      normalized: normalizeKey(h)
    }));
    
    const dbColumnNames = dbColumns.map(col => col.column_name);
    
    // Map CSV to DB fields
    console.log('\n🔗 CSV to Database field mapping:');
    
    const csvToDbMapping = {
      'LicenseNo': 'license_no',
      'LastUpdate': 'last_update', 
      'BusinessName': 'business_name',
      'BUS-NAME-2': 'bus_name_2',
      'FullBusinessName': 'full_business_name',
      'MailingAddress': 'mailing_address',
      'City': 'city',
      'State': 'state', // Always CA for this dataset
      'County': 'county',
      'ZIPCode': 'zip_code',
      'country': 'country',
      'BusinessPhone': 'business_phone',
      'BusinessType': 'business_type',
      'IssueDate': 'issue_date',
      'ReissueDate': 'reissue_date',
      'ExpirationDate': 'expiration_date',
      'InactivationDate': 'inactivation_date',
      'ReactivationDate': 'reactivation_date',
      'PendingSuspension': 'pending_suspension',
      'PendingClassRemoval': 'pending_class_removal',
      'PendingClassReplace': 'pending_class_replace',
      'PrimaryStatus': 'primary_status',
      'SecondaryStatus': 'secondary_status',
      'Classifications(s)': 'raw_classifications', // Processed into multiple fields
      'AsbestosReg': 'asbestos_reg',
      'WorkersCompCoverageType': 'workers_comp_coverage_type',
      'WCInsuranceCompany': 'wc_insurance_company',
      'WCPolicyNumber': 'wc_policy_number',
      'WCEffectiveDate': 'wc_effective_date',
      'WCExpirationDate': 'wc_expiration_date',
      'WCCancellationDate': 'wc_cancellation_date',
      'WCSuspendDate': 'wc_suspend_date',
      'CBSuretyCompany': 'cb_surety_company',
      'CBNumber': 'cb_number',
      'CBEffectiveDate': 'cb_effective_date',
      'CBCancellationDate': 'cb_cancellation_date',
      'CBAmount': 'cb_amount',
      'WBSuretyCompany': 'wb_surety_company',
      'WBNumber': 'wb_number',
      'WBEffectiveDate': 'wb_effective_date',
      'WBCancellationDate': 'wb_cancellation_date',
      'WBAmount': 'wb_amount',
      'DBSuretyCompany': 'db_surety_company',
      'DBNumber': 'db_number',
      'DBEffectiveDate': 'db_effective_date',
      'DBCancellationDate': 'db_cancellation_date',
      'DBAmount': 'db_amount',
      'DateRequired': 'date_required',
      'DiscpCaseRegion': 'discp_case_region',
      'DBBondReason': 'db_bond_reason',
      'DBCaseNo': 'db_case_no',
      'NAME-TP-2': 'name_tp_2'
    };
    
    // Show mapping
    let mappedCount = 0;
    let missingFromDb = [];
    let fieldsNotImporting = [];
    
    csvHeaders.forEach(csvHeader => {
      const dbField = csvToDbMapping[csvHeader];
      if (dbField) {
        if (dbColumnNames.includes(dbField)) {
          console.log(`  ✅ ${csvHeader} -> ${dbField}`);
          mappedCount++;
        } else {
          console.log(`  ❌ ${csvHeader} -> ${dbField} (DB field missing)`);
          missingFromDb.push(dbField);
        }
      } else {
        console.log(`  ⚠️  ${csvHeader} -> (not mapped)`);
        fieldsNotImporting.push(csvHeader);
      }
    });
    
    console.log('\n📊 Summary:');
    console.log(`  Total CSV columns: ${csvHeaders.length}`);
    console.log(`  Mapped to DB: ${mappedCount}`);
    console.log(`  Missing from DB: ${missingFromDb.length}`);
    console.log(`  Not importing: ${fieldsNotImporting.length}`);
    
    if (missingFromDb.length > 0) {
      console.log('\n❌ DB fields that should exist but are missing:');
      missingFromDb.forEach(field => console.log(`  - ${field}`));
    }
    
    if (fieldsNotImporting.length > 0) {
      console.log('\n⚠️  CSV columns not being imported:');
      fieldsNotImporting.forEach(field => console.log(`  - ${field}`));
    }
    
    // Check what's actually being populated in current import
    console.log('\n🔍 Checking current import script usage...');
    
    // Get sample of populated vs empty fields
    const { rows: fieldUsage } = await client.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(state) as has_state,
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
        COUNT(business_type) as has_business_type,
        COUNT(workers_comp_coverage_type) as has_workers_comp,
        COUNT(wc_insurance_company) as has_wc_insurance,
        COUNT(cb_surety_company) as has_cb_surety,
        COUNT(wb_surety_company) as has_wb_surety,
        COUNT(db_surety_company) as has_db_surety,
        COUNT(asbestos_reg) as has_asbestos_reg,
        COUNT(pending_suspension) as has_pending_suspension,
        COUNT(discp_case_region) as has_discp_case
      FROM contractors
      LIMIT 1
    `);
    
    const usage = fieldUsage[0];
    console.log('\n📈 Field population in current database:');
    Object.entries(usage).forEach(([field, count]) => {
      const percentage = ((count / usage.total_records) * 100).toFixed(1);
      const status = percentage > 50 ? '✅' : percentage > 10 ? '⚠️' : '❌';
      console.log(`  ${status} ${field}: ${count}/${usage.total_records} (${percentage}%)`);
    });
    
  } finally {
    await client.end();
  }
}

compareColumns().catch(console.error);