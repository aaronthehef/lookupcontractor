import { createReadStream, createWriteStream } from 'fs';
import { parse } from 'csv-parse';
import pkg from 'pg';
const { Client } = pkg;

// Neon connection
const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Enhanced classification mapping (same as before)
const classificationMap = {
  A: "General Engineering Contractor",
  B: "General Building Contractor",
  "B-2": "Residential Remodeling Contractor",
  "C-2": "Insulation and Acoustical Contractor",
  C2: "Insulation and Acoustical Contractor",
  "C-4": "Boiler, Hot Water Heating and Steam Fitting Contractor",
  C4: "Boiler, Hot Water Heating and Steam Fitting Contractor",
  "C-5": "Framing and Rough Carpentry Contractor",
  C5: "Framing and Rough Carpentry Contractor",
  "C-6": "Cabinet, Millwork and Finish Carpentry Contractor",
  C6: "Cabinet, Millwork and Finish Carpentry Contractor",
  "C-7": "Low Voltage Systems Contractor",
  C7: "Low Voltage Systems Contractor",
  "C-8": "Concrete Contractor",
  C8: "Concrete Contractor",
  "C-9": "Drywall Contractor",
  C9: "Drywall Contractor",
  "C-10": "Electrical Contractor",
  C10: "Electrical Contractor",
  "C-11": "Elevator Contractor",
  C11: "Elevator Contractor",
  "C-12": "Earthwork and Paving Contractors",
  C12: "Earthwork and Paving Contractors",
  "C-13": "Fencing Contractor",
  C13: "Fencing Contractor",
  "C-15": "Flooring and Floor Covering Contractors",
  C15: "Flooring and Floor Covering Contractors",
  "C-16": "Fire Protection Contractor",
  C16: "Fire Protection Contractor",
  "C-17": "Glazing Contractor",
  C17: "Glazing Contractor",
  "C-20": "Warm-Air Heating, Ventilating and Air-Conditioning Contractor",
  C20: "Warm-Air Heating, Ventilating and Air-Conditioning Contractor",
  "C-21": "Building Moving/Demolition Contractor",
  C21: "Building Moving/Demolition Contractor",
  "C-22": "Asbestos Abatement Contractor",
  C22: "Asbestos Abatement Contractor",
  "C-23": "Ornamental Metal Contractor",
  C23: "Ornamental Metal Contractor",
  "C-27": "Landscaping Contractor",
  C27: "Landscaping Contractor",
  "C-28": "Lock and Security Equipment Contractor",
  C28: "Lock and Security Equipment Contractor",
  "C-29": "Masonry Contractor",
  C29: "Masonry Contractor",
  "C-31": "Construction Zone Traffic Control Contractor",
  C31: "Construction Zone Traffic Control Contractor",
  "C-32": "Parking and Highway Improvement Contractor",
  C32: "Parking and Highway Improvement Contractor",
  "C-33": "Painting and Decorating Contractor",
  C33: "Painting and Decorating Contractor",
  "C-34": "Pipeline Contractor",
  C34: "Pipeline Contractor",
  "C-35": "Lathing and Plastering Contractor",
  C35: "Lathing and Plastering Contractor",
  "C-36": "Plumbing Contractor",
  C36: "Plumbing Contractor",
  "C-38": "Refrigeration Contractor",
  C38: "Refrigeration Contractor",
  "C-39": "Roofing Contractor",
  C39: "Roofing Contractor",
  "C-42": "Sanitation System Contractor",
  C42: "Sanitation System Contractor",
  "C-43": "Sheet Metal Contractor",
  C43: "Sheet Metal Contractor",
  "C-45": "Sign Contractor",
  C45: "Sign Contractor",
  "C-46": "Solar Contractor",
  C46: "Solar Contractor",
  "C-47": "General Manufactured Housing Contractor",
  C47: "General Manufactured Housing Contractor",
  "C-49": "Tree and Palm Contractor",
  C49: "Tree and Palm Contractor",
  "C-50": "Reinforcing Steel Contractor",
  C50: "Reinforcing Steel Contractor",
  "C-51": "Structural Steel Contractor",
  C51: "Structural Steel Contractor",
  "C-53": "Swimming Pool Contractor",
  C53: "Swimming Pool Contractor",
  "C-54": "Ceramic and Mosaic Tile Contractor",
  C54: "Ceramic and Mosaic Tile Contractor",
  "C-55": "Water Conditioning Contractor",
  C55: "Water Conditioning Contractor",
  "C-57": "Well Drilling Contractor",
  C57: "Well Drilling Contractor",
  "C-60": "Welding Contractor",
  C60: "Welding Contractor",
  "C-61": "Limited Specialty",
  C61: "Limited Specialty",
  ASB: "Asbestos Certification",
  HAZ: "Hazardous Substance Removal Certification",
  D35: "Pool and Spa Maintenance Contractor",
  D49: "Tree and Palm Contractor",
  D52: "Window Coverings Contractor",
};

// All your existing helper functions (same as before)
function normalizeKeys(obj) {
  const normalized = {};
  for (const key in obj) {
    let trimmedKey = key.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
    const normalizedKey = trimmedKey.toLowerCase().replace(/[\s\(\)-]+/g, '').replace(/_+/g, '').replace(/^_+|_+$/g, '');
    normalized[normalizedKey] = obj[key];
  }
  return normalized;
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

function cleanString(str) {
  if (!str || typeof str !== 'string') return null;
  const trimmed = str.trim();
  return trimmed === '' ? null : trimmed;
}

function parseClassifications(classificationString) {
  if (!classificationString || typeof classificationString !== 'string') {
    return {
      raw_classifications: null,
      classification_codes: null,
      classification_descriptions: null,
      primary_classification: null,
      primary_trade: null
    };
  }

  const rawClassifications = classificationString.trim();
  const codes = rawClassifications.split(/[\|\s,;]+/).map(code => code.trim()).filter(code => code.length > 0).map(code => {
    code = code.toUpperCase();
    if (code === 'D49') code = 'C-49';
    if (code === 'D35') code = 'C-35';
    if (code === 'D52') code = 'C-52';
    if (code.match(/^C\d+$/)) {
      const num = code.substring(1);
      if (parseInt(num) > 9) {
        code = `C-${num}`;
      }
    }
    return code;
  }).filter((code, index, array) => array.indexOf(code) === index);

  if (codes.length === 0) {
    return {
      raw_classifications: rawClassifications,
      classification_codes: null,
      classification_descriptions: null,
      primary_classification: null,
      primary_trade: null
    };
  }

  const descriptions = codes.filter(code => classificationMap[code]).map(code => classificationMap[code]);

  let primaryClassification = null;
  let primaryTrade = null;

  if (codes.includes('A')) {
    primaryClassification = 'A';
    primaryTrade = classificationMap['A'];
  } else if (codes.includes('B')) {
    primaryClassification = 'B';
    primaryTrade = classificationMap['B'];
  } else if (codes.includes('B-2')) {
    primaryClassification = 'B-2';
    primaryTrade = classificationMap['B-2'];
  } else {
    const cClassification = codes.find(code => code.startsWith('C'));
    if (cClassification && classificationMap[cClassification]) {
      primaryClassification = cClassification;
      primaryTrade = classificationMap[cClassification];
    } else if (codes.length > 0 && classificationMap[codes[0]]) {
      primaryClassification = codes[0];
      primaryTrade = classificationMap[codes[0]];
    }
  }

  return {
    raw_classifications: rawClassifications,
    classification_codes: codes.length > 0 ? codes.join(', ') : null,
    classification_descriptions: descriptions.length > 0 ? descriptions.join(', ') : null,
    primary_classification: primaryClassification,
    primary_trade: primaryTrade
  };
}

const invalidRowsStream = createWriteStream('./invalid_rows_missing_license_no.csv');
invalidRowsStream.write('rowNumber,rawData\n');

function mapRow(row, rowNumber) {
  if (!row.licenseno || row.licenseno.trim() === '') {
    invalidRowsStream.write(`${rowNumber},"${JSON.stringify(row).replace(/"/g, '""')}"\n`);
    throw new Error(`Missing license_no at row ${rowNumber}`);
  }

  const classificationData = parseClassifications(row.classificationss);

  return {
    state: 'CA',
    license_no: cleanString(row.licenseno),
    data_source: 'CSLB',
    last_update: parseDate(row.lastupdate),
    business_name: cleanString(row.businessname),
    bus_name_2: cleanString(row.busname2),
    full_business_name: cleanString(row.fullbusinessname),
    mailing_address: cleanString(row.mailingaddress),
    city: cleanString(row.city),
    county: cleanString(row.county),
    zip_code: cleanString(row.zipcode),
    country: cleanString(row.country),
    business_phone: cleanString(row.businessphone),
    business_type: cleanString(row.businesstype),
    issue_date: parseDate(row.issuedate),
    reissue_date: parseDate(row.reissuedate),
    expiration_date: parseDate(row.expirationdate),
    inactivation_date: parseDate(row.inactivationdate),
    reactivation_date: parseDate(row.reactivationdate),
    pending_suspension: cleanString(row.pendingsuspension),
    pending_class_removal: cleanString(row.pendingclassremoval),
    pending_class_replace: cleanString(row.pendingclassreplace),
    primary_status: cleanString(row.primarystatus),
    secondary_status: cleanString(row.secondarystatus),
    raw_classifications: classificationData.raw_classifications,
    classification_codes: classificationData.classification_codes,
    classification_descriptions: classificationData.classification_descriptions,
    primary_classification: classificationData.primary_classification,
    trade: classificationData.primary_trade,
    asbestos_reg: cleanString(row.asbestosreg),
    workers_comp_coverage_type: cleanString(row.workerscompcoveragetype),
    wc_insurance_company: cleanString(row.wcinsurancecompany),
    wc_policy_number: cleanString(row.wcpolicynumber),
    wc_effective_date: parseDate(row.wceffectivedate),
    wc_expiration_date: parseDate(row.wcexpirationdate),
    wc_cancellation_date: parseDate(row.wccancellationdate),
    wc_suspend_date: parseDate(row.wcsuspenddate),
    cb_surety_company: cleanString(row.cbsuretycompany),
    cb_number: cleanString(row.cbnumber),
    cb_effective_date: parseDate(row.cbeffectivedate),
    cb_cancellation_date: parseDate(row.cbcancellationdate),
    cb_amount: parseInteger(row.cbamount),
    wb_surety_company: cleanString(row.wbsuretycompany),
    wb_number: cleanString(row.wbnumber),
    wb_effective_date: parseDate(row.wbeffectivedate),
    wb_cancellation_date: parseDate(row.wbcancellationdate),
    wb_amount: parseInteger(row.wbamount),
    db_surety_company: cleanString(row.dbsuretycompany),
    db_number: cleanString(row.dbnumber),
    db_effective_date: parseDate(row.dbeffectivedate),
    db_cancellation_date: parseDate(row.dbcancellationdate),
    db_amount: parseInteger(row.dbamount),
    date_required: parseDate(row.daterequired),
    discp_case_region: cleanString(row.discpcaseregion),
    db_bond_reason: cleanString(row.dbbondreason),
    db_case_no: cleanString(row.dbcaseno),
    name_tp_2: cleanString(row.nametp2),
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processBatch(client, rows, batchNumber, retryCount = 0) {
  if (rows.length === 0) return true;
  const maxRetries = 3;
  
  try {
    if (retryCount > 0) {
      console.log(`🔄 Batch ${batchNumber} retry ${retryCount}/${maxRetries}`);
      await sleep(1000 * retryCount);
    }
    
    // Simplified approach: process rows one by one in batch
    for (const row of rows) {
      await client.query(`
        INSERT INTO contractors (
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55)
        ON CONFLICT (state, license_no) DO UPDATE SET
          business_name = EXCLUDED.business_name,
          last_update = EXCLUDED.last_update,
          updated_at = CURRENT_TIMESTAMP
      `, [
        row.state, row.license_no, row.data_source, row.last_update, row.business_name, row.bus_name_2, row.full_business_name,
        row.mailing_address, row.city, row.county, row.zip_code, row.country, row.business_phone, row.business_type,
        row.issue_date, row.reissue_date, row.expiration_date, row.inactivation_date, row.reactivation_date,
        row.pending_suspension, row.pending_class_removal, row.pending_class_replace, row.primary_status, row.secondary_status,
        row.raw_classifications, row.classification_codes, row.classification_descriptions, row.primary_classification, row.trade,
        row.asbestos_reg, row.workers_comp_coverage_type, row.wc_insurance_company, row.wc_policy_number,
        row.wc_effective_date, row.wc_expiration_date, row.wc_cancellation_date, row.wc_suspend_date,
        row.cb_surety_company, row.cb_number, row.cb_effective_date, row.cb_cancellation_date, row.cb_amount,
        row.wb_surety_company, row.wb_number, row.wb_effective_date, row.wb_cancellation_date, row.wb_amount,
        row.db_surety_company, row.db_number, row.db_effective_date, row.db_cancellation_date, row.db_amount,
        row.date_required, row.discp_case_region, row.db_bond_reason, row.db_case_no, row.name_tp_2
      ]);
    }
    
    if (batchNumber % 100 === 0) {
      console.log(`✅ Batch ${batchNumber} completed successfully`);
    }
    
    return true;
    
  } catch (error) {
    if (retryCount < maxRetries) {
      console.log(`⚠️ Batch ${batchNumber} failed (${error.message}), retrying...`);
      return processBatch(client, rows, batchNumber, retryCount + 1);
    }
    
    console.error(`❌ Batch ${batchNumber} failed after ${retryCount + 1} attempts:`, error.message);
    
    // Try individual inserts as fallback
    console.log(`🔍 Attempting individual inserts for batch ${batchNumber}...`);
    let successCount = 0;
    
    for (let i = 0; i < rows.length; i++) {
      try {
        await sleep(100);
        const row = rows[i];
        await client.query(`
          INSERT INTO contractors (
            state, license_no, data_source, business_name, city, primary_classification, trade
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (state, license_no) DO UPDATE SET
            business_name = EXCLUDED.business_name,
            updated_at = CURRENT_TIMESTAMP
        `, [row.state, row.license_no, row.data_source, row.business_name, row.city, row.primary_classification, row.trade]);
        successCount++;
      } catch (err) {
        console.error(`❌ Individual insert failed for license_no=${rows[i].license_no}:`, err.message);
      }
    }
    
    console.log(`📊 Batch ${batchNumber}: ${successCount}/${rows.length} individual inserts successful`);
    return successCount > 0;
  }
}

async function main() {
  console.log('🚀 Starting CSLB contractor CSV import to Neon...');

  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;
  let batchNumber = 0;
  const batchSize = 10; // Start with small batches
  let batch = [];
  
  const client = new Client({ connectionString });
  await client.connect();
  console.log('✅ Connected to Neon database');

  try {
    const { rows } = await client.query('SELECT COUNT(*) FROM contractors WHERE state = $1', ['CA']);
    console.log(`📊 Currently in DB: ${rows[0].count} CA records`);
  } catch {
    console.warn('⚠️ Unable to retrieve current record count.');
  }

  const csvStream = createReadStream('./cslb_master_list.csv');
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    skip_records_with_error: false,
    relax_quotes: true,
  });

  parser.on('error', (err) => {
    console.error('❌ CSV parse error:', err);
  });

  csvStream.on('error', (err) => {
    console.error('❌ CSV file read error:', err);
  });

  parser.on('data', async (row) => {
    processedCount++;
    
    try {
      const normRow = normalizeKeys(row);
      
      if (processedCount <= 5) {
        console.log(`🔍 Row ${processedCount} classification:`, normRow.classificationss);
      }
      
      if (!normRow.licenseno || !normRow.licenseno.trim()) {
        console.warn(`⚠️ Missing license_no at row ${processedCount}`);
        errorCount++;
        return;
      }
      
      const mappedRow = mapRow(normRow, processedCount);
      batch.push(mappedRow);
      
      if (processedCount % 1000 === 0) {
        console.log(`📖 Processed ${processedCount} rows, current batch size: ${batch.length}`);
      }
      
      if (batch.length >= batchSize) {
        const batchData = [...batch];
        batch = [];
        batchNumber++;
        
        parser.pause();
        
        const success = await processBatch(client, batchData, batchNumber);
        if (success) {
          successCount += batchData.length;
        } else {
          errorCount++;
        }
        
        await sleep(500); // Brief pause between batches
        parser.resume();
      }
      
    } catch (error) {
      errorCount++;
      console.error(`❌ Row ${processedCount} skipped: ${error.message}`);
    }
  });

  parser.on('end', async () => {
    console.log('📖 Finished reading CSV file.');
    
    if (batch.length > 0) {
      batchNumber++;
      console.log(`🔄 Processing final batch ${batchNumber} with ${batch.length} records...`);
      
      const success = await processBatch(client, [...batch], batchNumber);
      if (success) {
        successCount += batch.length;
      } else {
        errorCount++;
      }
    }
    
    console.log('\n🎉 Import complete!');
    console.log(`📖 Total rows processed: ${processedCount}`);
    console.log(`✅ Total records inserted/updated: ${successCount}`);
    console.log(`❌ Total errors: ${errorCount}`);
    console.log(`📊 Success rate: ${((successCount / processedCount) * 100).toFixed(2)}%`);
    
    try {
      const { rows } = await client.query('SELECT COUNT(*) FROM contractors WHERE state = $1', ['CA']);
      console.log(`🗄️ Final records in DB: ${rows[0].count}`);
    } catch {
      console.warn('⚠️ Could not fetch final database record count.');
    }
    
    await client.end();
    invalidRowsStream.end();
  });

  csvStream.pipe(parser);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});