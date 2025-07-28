import { createReadStream, createWriteStream } from 'fs';
import { parse } from 'csv-parse';
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://wmwbjfpdhrnvnaazecoe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd2JqZnBkaHJudm5hYXplY29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzYwNDEsImV4cCI6MjA2OTIxMjA0MX0.qqtt8WbNEoNsdU_wTkhoTG0OvRlHis9HZ5iAEIazGyU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced classification mapping
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
  // Legacy mappings for compatibility
  D35: "Pool and Spa Maintenance Contractor",
  D49: "Tree and Palm Contractor", // Same as C-49
  D52: "Window Coverings Contractor",
};

// FIXED: Normalizes keys without converting camelCase to snake_case
function normalizeKeys(obj) {
  const normalized = {};
  for (const key in obj) {
    let trimmedKey = key.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
    
    const normalizedKey = trimmedKey
      .toLowerCase()
      .replace(/[\s\(\)-]+/g, '')
      .replace(/_+/g, '')
      .replace(/^_+|_+$/g, '');
    
    normalized[normalizedKey] = obj[key];
  }
  return normalized;
}

// Safe ISO date parsing
function parseDate(str) {
  if (!str || typeof str !== 'string' || str.trim() === '') return null;
  try {
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

// Parse integer, removing commas/dollars
function parseInteger(val) {
  if (!val || typeof val !== 'string' || val.trim() === '') return null;
  const cleaned = val.replace(/[,$]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? null : parsed;
}

// Trim string, return null if empty
function cleanString(str) {
  if (!str || typeof str !== 'string') return null;
  const trimmed = str.trim();
  return trimmed === '' ? null : trimmed;
}

// Enhanced classification parsing
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
  
  // Split by various delimiters: |, space, comma, semicolon
  const codes = rawClassifications
    .split(/[\|\s,;]+/)
    .map(code => code.trim())
    .filter(code => code.length > 0)
    .map(code => {
      // Normalize the code format
      code = code.toUpperCase();
      
      // Handle D49 -> C-49 mapping and similar legacy codes
      if (code === 'D49') code = 'C-49';
      if (code === 'D35') code = 'C-35'; // If this mapping exists
      if (code === 'D52') code = 'C-52'; // If this mapping exists
      
      // Ensure consistent formatting (some have dashes, some don't)
      if (code.match(/^C\d+$/)) {
        // Convert C10 to C-10 format for consistency
        const num = code.substring(1);
        if (parseInt(num) > 9) { // Only add dash for double digit numbers
          code = `C-${num}`;
        }
      }
      
      return code;
    })
    .filter((code, index, array) => array.indexOf(code) === index); // Remove duplicates

  if (codes.length === 0) {
    return {
      raw_classifications: rawClassifications,
      classification_codes: null,
      classification_descriptions: null,
      primary_classification: null,
      primary_trade: null
    };
  }

  // Get descriptions for valid codes
  const descriptions = codes
    .filter(code => classificationMap[code])
    .map(code => classificationMap[code]);

  // Determine primary classification (prefer A, then B, then C classifications)
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
    // Find first C classification
    const cClassification = codes.find(code => code.startsWith('C'));
    if (cClassification && classificationMap[cClassification]) {
      primaryClassification = cClassification;
      primaryTrade = classificationMap[cClassification];
    } else if (codes.length > 0 && classificationMap[codes[0]]) {
      // Fall back to first valid classification
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

// File for logging rows missing license_no for review
const invalidRowsStream = createWriteStream('./invalid_rows_missing_license_no.csv');
invalidRowsStream.write('rowNumber,rawData\n');

function mapRow(row, rowNumber) {
  if (!row.licenseno || row.licenseno.trim() === '') {
    invalidRowsStream.write(`${rowNumber},"${JSON.stringify(row).replace(/"/g, '""')}"\n`);
    throw new Error(`Missing license_no at row ${rowNumber}`);
  }

  // Parse classifications
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
    // Enhanced classification fields
    raw_classifications: classificationData.raw_classifications,
    classification_codes: classificationData.classification_codes,
    classification_descriptions: classificationData.classification_descriptions,
    primary_classification: classificationData.primary_classification,
    trade: classificationData.primary_trade, // Keep original field name for compatibility
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

async function processBatch(rows, batchNumber, retryCount = 0) {
  if (rows.length === 0) return true;
  const maxRetries = 5; // Reduced retries to fail faster
  
  try {
    // Simple exponential backoff without jitter
    const delay = Math.min(2000 * Math.pow(2, retryCount), 15000);
    
    if (retryCount > 0) {
      console.log(`🔄 Batch ${batchNumber} retry ${retryCount}/${maxRetries} after ${delay}ms delay`);
      await sleep(delay);
    }
    
    // Simple upsert without timeout wrapper (let Supabase handle its own timeouts)
    const { error } = await supabase.from('contractors').upsert(rows, {
      onConflict: 'state,license_no',
      ignoreDuplicates: false,
    });
    
    if (error) throw error;
    
    if (batchNumber % 100 === 0) {
      console.log(`✅ Batch ${batchNumber} completed successfully`);
    }
    
    return true;
    
  } catch (error) {
    const errMsg = (error.message || '').toLowerCase();
    const retryableErrors = [
      'fetch failed', 'connect error', 'timeout', '502', '503', '504',
      'network error', 'connection reset', 'econnreset'
    ];
    
    const isRetryableError = retryableErrors.some(e => errMsg.includes(e));
    
    if (isRetryableError && retryCount < maxRetries) {
      console.log(`⚠️ Batch ${batchNumber} failed (${error.message}), retrying...`);
      return processBatch(rows, batchNumber, retryCount + 1);
    }
    
    console.error(`❌ Batch ${batchNumber} failed after ${retryCount + 1} attempts:`, error.message);
    
    // Try individual inserts as fallback with longer delays
    console.log(`🔍 Attempting individual inserts for batch ${batchNumber}...`);
    let successCount = 0;
    
    for (let i = 0; i < rows.length; i++) {
      try {
        await sleep(500); // Longer delay between individual inserts
        await supabase.from('contractors').upsert([rows[i]], {
          onConflict: 'state,license_no',
          ignoreDuplicates: false,
        });
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
  console.log('🚀 Starting enhanced CSLB contractor CSV import...');

  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;
  let batchNumber = 0;
  const batchSize = 1; // Single record batches for reliability
  let batch = [];
  
  // Track progress with checkpoint saving
  let lastCheckpoint = 0;
  const checkpointInterval = 10000; // Save progress every 10k records

  try {
    const { count } = await supabase.from('contractors').select('*', { count: 'exact', head: true }).eq('state', 'CA');
    console.log(`📊 Currently in DB: ${count} CA records`);
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

  // Use synchronous data processing to avoid overwhelming Supabase
  let isPaused = false;
  
  parser.on('data', (row) => {
    processedCount++;
    
    try {
      const normRow = normalizeKeys(row);
      
      // Debug classification field mapping
      if (processedCount <= 5) {
        console.log(`🔍 Row ${processedCount} classification field mapping:`);
        console.log('Raw CSV keys:', Object.keys(row));
        console.log('Normalized keys:', Object.keys(normRow));
        console.log('Looking for classifications in:', Object.keys(normRow).filter(k => k.includes('class')));
        console.log('Classifications value:', normRow.classificationss);
        
        // Check if it's under a different key
        const classKeys = Object.keys(normRow).filter(k => k.toLowerCase().includes('class'));
        console.log('All classification-related keys:', classKeys);
        classKeys.forEach(key => {
          console.log(`${key}:`, normRow[key]);
        });
        console.log('---');
      }
      
      if (!normRow.licenseno || !normRow.licenseno.trim()) {
        console.warn(`⚠️ Missing license_no at row ${processedCount}`);
        errorCount++;
        return;
      }
      
      const mappedRow = mapRow(normRow, processedCount);
      batch.push(mappedRow);
      
      // Progress reporting
      if (processedCount % 1000 === 0) {
        console.log(`📖 Processed ${processedCount} rows, current batch size: ${batch.length}`);
      }
      
      // Process batch when full - pause the parser during processing
      if (batch.length >= batchSize) {
        const batchData = [...batch];
        batch = [];
        batchNumber++;
        
        // Pause the parser to prevent memory buildup
        parser.pause();
        isPaused = true;
        
        // Process the batch
        processBatch(batchData, batchNumber)
          .then((success) => {
            if (success) {
              successCount += batchData.length;
            } else {
              errorCount++;
            }
            
            // Checkpoint progress
            if (processedCount - lastCheckpoint >= checkpointInterval) {
              console.log(`🏁 Checkpoint: ${processedCount} rows processed, ${successCount} successfully inserted`);
              lastCheckpoint = processedCount;
            }
            
            // Resume parsing after a delay
            setTimeout(() => {
              isPaused = false;
              parser.resume();
            }, 1000); // 1 second delay between batches
          })
          .catch((error) => {
            errorCount++;
            console.error(`❌ Batch ${batchNumber} processing failed:`, error.message);
            
            // Resume parsing even on error
            setTimeout(() => {
              isPaused = false;
              parser.resume();
            }, 5000); // Longer delay on error
          });
      }
      
    } catch (error) {
      errorCount++;
      console.error(`❌ Row ${processedCount} skipped: ${error.message}`);
    }
  });

  parser.on('end', async () => {
    console.log('📖 Finished reading CSV file.');
    
    // Process final batch if there is one
    if (batch.length > 0) {
      batchNumber++;
      console.log(`🔄 Processing final batch ${batchNumber} with ${batch.length} records...`);
      
      const success = await processBatch([...batch], batchNumber);
      if (success) {
        successCount += batch.length;
      } else {
        errorCount++;
      }
    }
    
    // Wait a moment for any pending operations
    await sleep(2000);
    
    console.log('\n🎉 Import complete!');
    console.log(`📖 Total rows processed: ${processedCount}`);
    console.log(`✅ Total records inserted/updated: ${successCount}`);
    console.log(`❌ Total errors: ${errorCount}`);
    console.log(`📊 Success rate: ${((successCount / processedCount) * 100).toFixed(2)}%`);
    
    try {
      const { count } = await supabase.from('contractors').select('*', { count: 'exact', head: true }).eq('state', 'CA');
      console.log(`🗄️ Final records in DB: ${count}`);
    } catch {
      console.warn('⚠️ Could not fetch final database record count.');
    }
    
    invalidRowsStream.end();
  });

  csvStream.pipe(parser);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});