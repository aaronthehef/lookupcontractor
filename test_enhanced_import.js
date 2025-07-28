import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Same helper functions as import_complete.js
function normalizeKeys(obj) {
  const normalized = {};
  for (const key in obj) {
    const normalizedKey = key.trim().toLowerCase().replace(/[\s\(\)-]+/g, '').replace(/_+/g, '');
    normalized[normalizedKey] = obj[key];
  }
  return normalized;
}

function cleanString(str) {
  return str && typeof str === 'string' && str.trim() !== '' ? str.trim() : null;
}

function parseDate(str) {
  if (!str || typeof str !== 'string' || str.trim() === '') return null;
  try {
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

function parseInteger(val) {
  if (!val || typeof val !== 'string' || val.trim() === '') return null;
  const cleaned = val.replace(/[,$]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? null : parsed;
}

// Simplified classification parsing for test
function parseClassifications(classificationString) {
  if (!classificationString) return { 
    raw_classifications: null, 
    classification_codes: null,
    classification_descriptions: null,
    primary_classification: null, 
    primary_trade: null 
  };
  
  const codes = classificationString.split(/[\|\s,;]+/).map(c => c.trim().toUpperCase()).filter(Boolean);
  const primaryCode = codes[0] || null;
  
  return {
    raw_classifications: classificationString.trim(),
    classification_codes: codes.join(', '),
    classification_descriptions: null, // Will be filled by existing logic
    primary_classification: primaryCode,
    primary_trade: null // Will be filled by existing logic
  };
}

async function testEnhancedImport() {
  console.log('🧪 Testing enhanced import with 5 records...\n');
  
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    // Create a test table to avoid affecting main data
    console.log('📋 Creating test table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS contractors_test (LIKE contractors INCLUDING ALL)
    `);
    
    console.log('🧹 Clearing test table...');
    await client.query('TRUNCATE contractors_test');
    
    // Read first 5 records from CSV
    let processedCount = 0;
    const testRecords = [];
    
    const csvStream = createReadStream('./cslb_master_list.csv');
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      relax_quotes: true,
    });

    parser.on('data', (row) => {
      if (processedCount >= 5) return;
      
      processedCount++;
      
      try {
        const normRow = normalizeKeys(row);
        
        if (!normRow.licenseno || !normRow.licenseno.trim()) {
          console.warn(`⚠️ Skipping row ${processedCount} - no license number`);
          return;
        }

        const classificationData = parseClassifications(normRow.classificationss);
        
        console.log(`🔍 Test Record ${processedCount}:`);
        console.log(`  License: ${normRow.licenseno}`);
        console.log(`  Business: ${normRow.businessname}`);
        console.log(`  City: ${normRow.city}`);
        console.log(`  Classification: ${classificationData.raw_classifications}`);
        console.log(`  Phone: ${normRow.businessphone || 'N/A'}`);
        console.log(`  Status: ${normRow.primarystatus || 'N/A'}`);
        console.log(`  Issue Date: ${normRow.issuedate || 'N/A'}`);
        console.log(`  Bond Amount: ${normRow.cbamount || 'N/A'}`);
        console.log('');

        const record = {
          state: 'CA',
          license_no: cleanString(normRow.licenseno),
          data_source: 'CSLB_TEST',
          last_update: parseDate(normRow.lastupdate),
          business_name: cleanString(normRow.businessname),
          bus_name_2: cleanString(normRow.busname2),
          full_business_name: cleanString(normRow.fullbusinessname),
          mailing_address: cleanString(normRow.mailingaddress),
          city: cleanString(normRow.city),
          county: cleanString(normRow.county),
          zip_code: cleanString(normRow.zipcode),
          country: cleanString(normRow.country),
          business_phone: cleanString(normRow.businessphone),
          business_type: cleanString(normRow.businesstype),
          issue_date: parseDate(normRow.issuedate),
          reissue_date: parseDate(normRow.reissuedate),
          expiration_date: parseDate(normRow.expirationdate),
          inactivation_date: parseDate(normRow.inactivationdate),
          reactivation_date: parseDate(normRow.reactivationdate),
          pending_suspension: cleanString(normRow.pendingsuspension),
          pending_class_removal: cleanString(normRow.pendingclassremoval),
          pending_class_replace: cleanString(normRow.pendingclassreplace),
          primary_status: cleanString(normRow.primarystatus),
          secondary_status: cleanString(normRow.secondarystatus),
          raw_classifications: classificationData.raw_classifications,
          classification_codes: classificationData.classification_codes,
          classification_descriptions: classificationData.classification_descriptions,
          primary_classification: classificationData.primary_classification,
          trade: classificationData.primary_trade,
          asbestos_reg: cleanString(normRow.asbestosreg),
          workers_comp_coverage_type: cleanString(normRow.workerscompcoveragetype),
          wc_insurance_company: cleanString(normRow.wcinsurancecompany),
          wc_policy_number: cleanString(normRow.wcpolicynumber),
          wc_effective_date: parseDate(normRow.wceffectivedate),
          wc_expiration_date: parseDate(normRow.wcexpirationdate),
          wc_cancellation_date: parseDate(normRow.wccancellationdate),
          wc_suspend_date: parseDate(normRow.wcsuspenddate),
          cb_surety_company: cleanString(normRow.cbsuretycompany),
          cb_number: cleanString(normRow.cbnumber),
          cb_effective_date: parseDate(normRow.cbeffectivedate),
          cb_cancellation_date: parseDate(normRow.cbcancellationdate),
          cb_amount: parseInteger(normRow.cbamount),
          wb_surety_company: cleanString(normRow.wbsuretycompany),
          wb_number: cleanString(normRow.wbnumber),
          wb_effective_date: parseDate(normRow.wbeffectivedate),
          wb_cancellation_date: parseDate(normRow.wbcancellationdate),
          wb_amount: parseInteger(normRow.wbamount),
          db_surety_company: cleanString(normRow.dbsuretycompany),
          db_number: cleanString(normRow.dbnumber),
          db_effective_date: parseDate(normRow.dbeffectivedate),
          db_cancellation_date: parseDate(normRow.dbcancellationdate),
          db_amount: parseInteger(normRow.dbamount),
          date_required: parseDate(normRow.daterequired),
          discp_case_region: cleanString(normRow.discpcaseregion),
          db_bond_reason: cleanString(normRow.dbbondreason),
          db_case_no: cleanString(normRow.dbcaseno),
          name_tp_2: cleanString(normRow.nametp2)
        };

        testRecords.push(record);
        
      } catch (error) {
        console.error(`❌ Error processing row ${processedCount}: ${error.message}`);
      }
    });

    parser.on('end', async () => {
      console.log(`📊 Processed ${testRecords.length} test records\n`);
      
      // Test insertion
      let successCount = 0;
      for (const record of testRecords) {
        try {
          await client.query(`
            INSERT INTO contractors_test (
              state, license_no, data_source, last_update, business_name, bus_name_2, full_business_name,
              mailing_address, city, county, zip_code, country, business_phone, business_type,
              issue_date, reissue_date, expiration_date, inactivation_date, reactivation_date,
              pending_suspension, pending_class_removal, pending_class_replace, primary_status, secondary_status,
              raw_classifications, classification_codes, classification_descriptions, primary_classification, trade,
              asbestos_reg, workers_comp_coverage_type, wc_insurance_company, wc_policy_number,
              wc_effective_date, wc_expiration_date, wc_cancellation_date, wc_suspend_date,
              cb_surety_company, cb_number, cb_effective_date, cb_cancellation_date, cb_amount,
              wb_surety_company, wb_number, wb_effective_date, wb_cancellation_date, wb_amount,
              db_surety_company, db_number, db_effective_date, db_cancellation_date, db_amount,
              date_required, discp_case_region, db_bond_reason, db_case_no, name_tp_2
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57)
          `, [
            record.state, record.license_no, record.data_source, record.last_update, record.business_name, record.bus_name_2, record.full_business_name,
            record.mailing_address, record.city, record.county, record.zip_code, record.country, record.business_phone, record.business_type,
            record.issue_date, record.reissue_date, record.expiration_date, record.inactivation_date, record.reactivation_date,
            record.pending_suspension, record.pending_class_removal, record.pending_class_replace, record.primary_status, record.secondary_status,
            record.raw_classifications, record.classification_codes, record.classification_descriptions, record.primary_classification, record.trade,
            record.asbestos_reg, record.workers_comp_coverage_type, record.wc_insurance_company, record.wc_policy_number,
            record.wc_effective_date, record.wc_expiration_date, record.wc_cancellation_date, record.wc_suspend_date,
            record.cb_surety_company, record.cb_number, record.cb_effective_date, record.cb_cancellation_date, record.cb_amount,
            record.wb_surety_company, record.wb_number, record.wb_effective_date, record.wb_cancellation_date, record.wb_amount,
            record.db_surety_company, record.db_number, record.db_effective_date, record.db_cancellation_date, record.db_amount,
            record.date_required, record.discp_case_region, record.db_bond_reason, record.db_case_no, record.name_tp_2
          ]);
          
          console.log(`✅ Successfully inserted: ${record.license_no} - ${record.business_name}`);
          successCount++;
          
        } catch (error) {
          console.error(`❌ Failed to insert ${record.license_no}: ${error.message}`);
        }
      }
      
      console.log(`\n🎉 Test Results:`);
      console.log(`  Records processed: ${testRecords.length}`);
      console.log(`  Successfully inserted: ${successCount}`);
      console.log(`  Errors: ${testRecords.length - successCount}`);
      
      // Show what got inserted
      console.log(`\n📋 Verifying inserted data...`);
      const { rows } = await client.query(`
        SELECT 
          license_no, business_name, city, county, zip_code, business_phone, 
          primary_status, issue_date, cb_amount, raw_classifications
        FROM contractors_test 
        ORDER BY license_no
      `);
      
      rows.forEach((row, i) => {
        console.log(`\n📊 Record ${i + 1}:`);
        console.log(`  License: ${row.license_no}`);
        console.log(`  Business: ${row.business_name}`);
        console.log(`  Location: ${row.city}, ${row.county || 'N/A'} ${row.zip_code || ''}`);
        console.log(`  Phone: ${row.business_phone || 'N/A'}`);
        console.log(`  Status: ${row.primary_status || 'N/A'}`);
        console.log(`  Issue Date: ${row.issue_date || 'N/A'}`);
        console.log(`  Bond Amount: ${row.cb_amount || 'N/A'}`);
        console.log(`  Classifications: ${row.raw_classifications || 'N/A'}`);
      });
      
      // Clean up test table
      console.log(`\n🧹 Cleaning up test table...`);
      await client.query('DROP TABLE contractors_test');
      
      if (successCount === testRecords.length && successCount > 0) {
        console.log(`\n🎉 TEST PASSED! Ready for full import.`);
      } else {
        console.log(`\n⚠️ TEST HAD ISSUES - review before full import.`);
      }
      
      await client.end();
    });

    csvStream.pipe(parser);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await client.end();
  }
}

testEnhancedImport().catch(console.error);