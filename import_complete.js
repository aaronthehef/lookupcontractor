import { createReadStream, createWriteStream } from 'fs';
import { parse } from 'csv-parse';
import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Complete CSLB Classification Map
const classificationMap = {
  // General Licenses
  A: "General Engineering Contractor",
  B: "General Building Contractor",
  "B-2": "Residential Remodeling Contractor",
  
  // C-Class Specialty Licenses (44 categories)
  "C-2": "Insulation and Acoustical Contractor",
  C2: "Insulation and Acoustical Contractor",
  "C-4": "Boiler, Hot Water Heating & Steam Fitting",
  C4: "Boiler, Hot Water Heating & Steam Fitting",
  "C-5": "Framing and Rough Carpentry",
  C5: "Framing and Rough Carpentry",
  "C-6": "Cabinet, Millwork and Finish Carpentry",
  C6: "Cabinet, Millwork and Finish Carpentry",
  "C-7": "Low Voltage Systems",
  C7: "Low Voltage Systems",
  "C-8": "Concrete",
  C8: "Concrete",
  "C-9": "Drywall",
  C9: "Drywall",
  "C-10": "Electrical",
  C10: "Electrical",
  "C-11": "Elevator",
  C11: "Elevator",
  "C-12": "Earthwork and Paving",
  C12: "Earthwork and Paving",
  "C-13": "Fencing",
  C13: "Fencing",
  "C-15": "Flooring and Floor Covering",
  C15: "Flooring and Floor Covering",
  "C-16": "Fire Protection",
  C16: "Fire Protection",
  "C-17": "Glazing",
  C17: "Glazing",
  "C-20": "Warm-Air Heating, Ventilation, and A/C",
  C20: "Warm-Air Heating, Ventilation, and A/C",
  "C-21": "Building Moving / Demolition",
  C21: "Building Moving / Demolition",
  "C-22": "Asbestos Abatement",
  C22: "Asbestos Abatement",
  "C-23": "Ornamental Metal",
  C23: "Ornamental Metal",
  "C-27": "Landscaping",
  C27: "Landscaping",
  "C-28": "Lock and Security Equipment",
  C28: "Lock and Security Equipment",
  "C-29": "Masonry",
  C29: "Masonry",
  "C-31": "Construction Zone Traffic Control",
  C31: "Construction Zone Traffic Control",
  "C-32": "Parking and Highway Improvement",
  C32: "Parking and Highway Improvement",
  "C-33": "Painting and Decorating",
  C33: "Painting and Decorating",
  "C-34": "Pipeline",
  C34: "Pipeline",
  "C-35": "Lathing and Plastering",
  C35: "Lathing and Plastering",
  "C-36": "Plumbing",
  C36: "Plumbing",
  "C-38": "Refrigeration",
  C38: "Refrigeration",
  "C-39": "Roofing",
  C39: "Roofing",
  "C-42": "Sanitation System",
  C42: "Sanitation System",
  "C-43": "Sheet Metal",
  C43: "Sheet Metal",
  "C-45": "Sign",
  C45: "Sign",
  "C-46": "Solar",
  C46: "Solar",
  "C-47": "General Manufactured Housing",
  C47: "General Manufactured Housing",
  "C-49": "Tree and Palm",
  C49: "Tree and Palm",
  "C-50": "Reinforcing Steel",
  C50: "Reinforcing Steel",
  "C-51": "Structural Steel",
  C51: "Structural Steel",
  "C-53": "Swimming Pool",
  C53: "Swimming Pool",
  "C-54": "Ceramic and Mosaic Tile",
  C54: "Ceramic and Mosaic Tile",
  "C-55": "Water Conditioning",
  C55: "Water Conditioning",
  "C-57": "Well Drilling",
  C57: "Well Drilling",
  "C-60": "Welding",
  C60: "Welding",
  "C-61": "Limited Specialty",
  C61: "Limited Specialty",
  
  // Active D-Subcategories (C-61 Limited Specialty)
  "D-3": "Awnings",
  D3: "Awnings",
  "D-4": "Central Vacuum Systems",
  D4: "Central Vacuum Systems",
  "D-6": "Concrete-Related Services",
  D6: "Concrete-Related Services",
  "D-9": "Drilling, Blasting & Oil Field Work",
  D9: "Drilling, Blasting & Oil Field Work",
  "D-10": "Elevated Floors",
  D10: "Elevated Floors",
  "D-12": "Synthetic Products",
  D12: "Synthetic Products",
  "D-16": "Hardware, Locks & Safes",
  D16: "Hardware, Locks & Safes",
  "D-21": "Machinery & Pumps",
  D21: "Machinery & Pumps",
  "D-24": "Metal Products",
  D24: "Metal Products",
  "D-28": "Doors, Gates & Activating Devices",
  D28: "Doors, Gates & Activating Devices",
  "D-29": "Paperhanging",
  D29: "Paperhanging",
  "D-30": "Pile Driving & Pressure Foundation Jacking",
  D30: "Pile Driving & Pressure Foundation Jacking",
  "D-31": "Pole Installation & Maintenance",
  D31: "Pole Installation & Maintenance",
  "D-34": "Prefabricated Equipment",
  D34: "Prefabricated Equipment",
  "D-35": "Pool & Spa Maintenance",
  D35: "Pool & Spa Maintenance",
  "D-38": "Sand & Water Blasting",
  D38: "Sand & Water Blasting",
  "D-39": "Scaffolding",
  D39: "Scaffolding",
  "D-40": "Service Station Equipment & Maintenance",
  D40: "Service Station Equipment & Maintenance",
  "D-41": "Siding & Decking",
  D41: "Siding & Decking",
  "D-42": "Non-Electrical Sign Installation",
  D42: "Non-Electrical Sign Installation",
  "D-49": "Tree Service",
  D49: "Tree Service",
  "D-50": "Suspended Ceilings",
  D50: "Suspended Ceilings",
  "D-52": "Window Coverings",
  D52: "Window Coverings",
  "D-53": "Wood Tanks",
  D53: "Wood Tanks",
  "D-56": "Trenching Only",
  D56: "Trenching Only",
  "D-59": "Hydroseed Spraying",
  D59: "Hydroseed Spraying",
  "D-62": "Air & Water Balancing",
  D62: "Air & Water Balancing",
  "D-63": "Construction Clean-up",
  D63: "Construction Clean-up",
  "D-64": "Non-Specialized",
  D64: "Non-Specialized",
  "D-65": "Weatherization & Energy Conservation",
  D65: "Weatherization & Energy Conservation",
  
  // Legacy/Obsolete D-Subcategories (may appear on old licenses)
  "D-1": "Architectural Porcelain (Obsolete)",
  D1: "Architectural Porcelain (Obsolete)",
  "D-2": "Asbestos Fabrication (Obsolete)",
  D2: "Asbestos Fabrication (Obsolete)",
  "D-5": "Communication Equipment (Obsolete)",
  D5: "Communication Equipment (Obsolete)",
  "D-7": "Conveyors & Cranes (Obsolete)",
  D7: "Conveyors & Cranes (Obsolete)",
  "D-8": "Doors & Door Services (Obsolete)",
  D8: "Doors & Door Services (Obsolete)",
  "D-11": "Fencing (Obsolete)",
  D11: "Fencing (Obsolete)",
  "D-13": "Fire Extinguisher Systems (Obsolete)",
  D13: "Fire Extinguisher Systems (Obsolete)",
  "D-14": "Floor Covering (Obsolete)",
  D14: "Floor Covering (Obsolete)",
  "D-15": "Furnaces (Obsolete)",
  D15: "Furnaces (Obsolete)",
  "D-17": "Industrial Insulation (Obsolete)",
  D17: "Industrial Insulation (Obsolete)",
  "D-19": "Land Clearing (Obsolete)",
  D19: "Land Clearing (Obsolete)",
  "D-20": "Lead Burning (Obsolete)",
  D20: "Lead Burning (Obsolete)",
  "D-22": "Marble (Obsolete)",
  D22: "Marble (Obsolete)",
  "D-23": "Medical Gas Systems (Obsolete)",
  D23: "Medical Gas Systems (Obsolete)",
  "D-25": "Mirrors & Fixed Glass (Obsolete)",
  D25: "Mirrors & Fixed Glass (Obsolete)",
  "D-26": "Mobile Home Installation (Obsolete)",
  D26: "Mobile Home Installation (Obsolete)",
  "D-27": "Movable Partitions (Obsolete)",
  D27: "Movable Partitions (Obsolete)",
  "D-32": "Power Nailing & Fastening (Obsolete)",
  D32: "Power Nailing & Fastening (Obsolete)",
  "D-33": "Precast Concrete Stairs (Obsolete)",
  D33: "Precast Concrete Stairs (Obsolete)",
  "D-36": "Rigging & Rig Building (Obsolete)",
  D36: "Rigging & Rig Building (Obsolete)",
  "D-37": "Safes & Vaults (Obsolete)",
  D37: "Safes & Vaults (Obsolete)",
  "D-43": "Soil Grouting (Obsolete)",
  D43: "Soil Grouting (Obsolete)",
  "D-44": "Sprinklers (Obsolete)",
  D44: "Sprinklers (Obsolete)",
  "D-45": "Staff & Stone (Obsolete)",
  D45: "Staff & Stone (Obsolete)",
  "D-46": "Steeple Jack Work (Obsolete)",
  D46: "Steeple Jack Work (Obsolete)",
  "D-47": "Tennis Court Surfacing (Obsolete)",
  D47: "Tennis Court Surfacing (Obsolete)",
  "D-48": "Theatre & School Equipment (Obsolete)",
  D48: "Theatre & School Equipment (Obsolete)",
  "D-51": "Waterproofing (Obsolete)",
  D51: "Waterproofing (Obsolete)",
  "D-54": "Rockscaping (Obsolete)",
  D54: "Rockscaping (Obsolete)",
  "D-55": "Blasting (Obsolete)",
  D55: "Blasting (Obsolete)",
  "D-57": "Propane Gas Plants (Obsolete)",
  D57: "Propane Gas Plants (Obsolete)",
  "D-58": "Floating Docks (Obsolete)",
  D58: "Floating Docks (Obsolete)",
  "D-60": "Striping (Obsolete)",
  D60: "Striping (Obsolete)",
  "D-61": "Gold Leaf Gilding (Obsolete)",
  D61: "Gold Leaf Gilding (Obsolete)",
  
  // Certifications
  ASB: "Asbestos Certification",
  HAZ: "Hazardous Substance Removal Certification"
};

function normalizeKeys(obj) {
  const normalized = {};
  for (const key in obj) {
    const normalizedKey = key.trim().toLowerCase().replace(/[\s\(\)-]+/g, '').replace(/_+/g, '');
    normalized[normalizedKey] = obj[key];
  }
  return normalized;
}

function parseClassifications(classificationString) {
  if (!classificationString) return { 
    raw_classifications: null, 
    classification_codes: null,
    classification_descriptions: null,
    primary_classification: null, 
    primary_trade: null 
  };
  
  const rawClassifications = classificationString.trim();
  
  // Split by various delimiters and normalize codes
  const codes = rawClassifications
    .split(/[\|\s,;]+/)
    .map(code => code.trim().toUpperCase())
    .filter(code => code.length > 0)
    .map(code => {
      // Handle legacy mappings
      if (code === 'D49') return 'D-49';
      if (code === 'D35') return 'D-35';
      if (code === 'D52') return 'D-52';
      
      // Ensure consistent formatting for C codes
      if (code.match(/^C\d+$/)) {
        const num = code.substring(1);
        if (parseInt(num) >= 10) {
          return `C-${num}`;
        }
      }
      
      // Ensure consistent formatting for D codes  
      if (code.match(/^D\d+$/)) {
        const num = code.substring(1);
        return `D-${num}`;
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

  // Determine primary classification (A > B > B-2 > C > D)
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
    } else {
      // Find first D classification
      const dClassification = codes.find(code => code.startsWith('D'));
      if (dClassification && classificationMap[dClassification]) {
        primaryClassification = dClassification;
        primaryTrade = classificationMap[dClassification];
      } else if (codes.length > 0 && classificationMap[codes[0]]) {
        // Fall back to first valid classification
        primaryClassification = codes[0];
        primaryTrade = classificationMap[codes[0]];
      }
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

async function main() {
  console.log('🚀 Starting complete CSLB CSV import to Neon...');

  const client = new Client({ connectionString });
  await client.connect();
  console.log('✅ Connected to Neon database');

  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;
  let batchCount = 0;
  const BATCH_SIZE = 100; // Process in smaller batches to avoid timeout
  let batch = [];

  // Progress checkpoint file
  const progressFile = './import_progress.json';
  let startFrom = 0;
  
  try {
    const fs = await import('fs');
    const progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
    startFrom = progress.lastProcessed || 0;
    console.log(`📍 Resuming from record ${startFrom}`);
  } catch {
    console.log('📍 Starting fresh import');
  }

  const csvStream = createReadStream('./cslb_master_list.csv');
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    relax_quotes: true,
  });

  async function processBatch(records) {
    if (records.length === 0) return;
    
    batchCount++;
    console.log(`🔄 Processing batch ${batchCount} (${records.length} records)...`);
    
    for (const record of records) {
      try {
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
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57)
          ON CONFLICT (state, license_no) DO UPDATE SET
            last_update = EXCLUDED.last_update,
            business_name = EXCLUDED.business_name,
            bus_name_2 = EXCLUDED.bus_name_2,
            full_business_name = EXCLUDED.full_business_name,
            mailing_address = EXCLUDED.mailing_address,
            city = EXCLUDED.city,
            county = EXCLUDED.county,
            zip_code = EXCLUDED.zip_code,
            country = EXCLUDED.country,
            business_phone = EXCLUDED.business_phone,
            business_type = EXCLUDED.business_type,
            issue_date = EXCLUDED.issue_date,
            reissue_date = EXCLUDED.reissue_date,
            expiration_date = EXCLUDED.expiration_date,
            inactivation_date = EXCLUDED.inactivation_date,
            reactivation_date = EXCLUDED.reactivation_date,
            pending_suspension = EXCLUDED.pending_suspension,
            pending_class_removal = EXCLUDED.pending_class_removal,
            pending_class_replace = EXCLUDED.pending_class_replace,
            primary_status = EXCLUDED.primary_status,
            secondary_status = EXCLUDED.secondary_status,
            raw_classifications = EXCLUDED.raw_classifications,
            classification_codes = EXCLUDED.classification_codes,
            classification_descriptions = EXCLUDED.classification_descriptions,
            primary_classification = EXCLUDED.primary_classification,
            trade = EXCLUDED.trade,
            asbestos_reg = EXCLUDED.asbestos_reg,
            workers_comp_coverage_type = EXCLUDED.workers_comp_coverage_type,
            wc_insurance_company = EXCLUDED.wc_insurance_company,
            wc_policy_number = EXCLUDED.wc_policy_number,
            wc_effective_date = EXCLUDED.wc_effective_date,
            wc_expiration_date = EXCLUDED.wc_expiration_date,
            wc_cancellation_date = EXCLUDED.wc_cancellation_date,
            wc_suspend_date = EXCLUDED.wc_suspend_date,
            cb_surety_company = EXCLUDED.cb_surety_company,
            cb_number = EXCLUDED.cb_number,
            cb_effective_date = EXCLUDED.cb_effective_date,
            cb_cancellation_date = EXCLUDED.cb_cancellation_date,
            cb_amount = EXCLUDED.cb_amount,
            wb_surety_company = EXCLUDED.wb_surety_company,
            wb_number = EXCLUDED.wb_number,
            wb_effective_date = EXCLUDED.wb_effective_date,
            wb_cancellation_date = EXCLUDED.wb_cancellation_date,
            wb_amount = EXCLUDED.wb_amount,
            db_surety_company = EXCLUDED.db_surety_company,
            db_number = EXCLUDED.db_number,
            db_effective_date = EXCLUDED.db_effective_date,
            db_cancellation_date = EXCLUDED.db_cancellation_date,
            db_amount = EXCLUDED.db_amount,
            date_required = EXCLUDED.date_required,
            discp_case_region = EXCLUDED.discp_case_region,
            db_bond_reason = EXCLUDED.db_bond_reason,
            db_case_no = EXCLUDED.db_case_no,
            name_tp_2 = EXCLUDED.name_tp_2,
            updated_at = CURRENT_TIMESTAMP
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
        successCount++;
      } catch (error) {
        errorCount++;
        if (errorCount <= 10) {
          console.error(`❌ Insert failed: ${error.message}`);
        }
      }
    }
    
    // Save progress
    const fs = await import('fs');
    fs.writeFileSync(progressFile, JSON.stringify({ 
      lastProcessed: processedCount,
      timestamp: new Date().toISOString()
    }));
    
    console.log(`✅ Batch ${batchCount} complete. Total: ${successCount} successful, ${errorCount} errors`);
  }

  parser.on('data', async (row) => {
    processedCount++;
    
    // Skip records we've already processed
    if (processedCount <= startFrom) {
      return;
    }
    
    try {
      const normRow = normalizeKeys(row);
      
      if (!normRow.licenseno || !normRow.licenseno.trim()) {
        errorCount++;
        return;
      }

      const classificationData = parseClassifications(normRow.classificationss);
      
      // Show sample data for first few records
      if (batch.length < 5 && processedCount > startFrom) {
        console.log(`🔍 Sample ${batch.length + 1}: ${normRow.licenseno} - ${classificationData.primary_classification} (${classificationData.primary_trade})`);
      }

      const record = {
        state: 'CA',
        license_no: cleanString(normRow.licenseno),
        data_source: 'CSLB',
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

      batch.push(record);
      
      if (batch.length >= BATCH_SIZE) {
        parser.pause(); // Pause CSV reading while processing
        await processBatch([...batch]);
        batch = [];
        parser.resume(); // Resume CSV reading
        
        // Brief pause to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error) {
      errorCount++;
      if (errorCount <= 10) {
        console.error(`❌ Row ${processedCount} failed: ${error.message}`);
      }
    }
  });

  parser.on('end', async () => {
    // Process final batch
    if (batch.length > 0) {
      await processBatch([...batch]);
    }
    
    console.log('\n🎉 Import complete!');
    console.log(`📖 Total rows processed: ${processedCount}`);
    console.log(`✅ Successful inserts: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Success rate: ${((successCount / (processedCount - startFrom)) * 100).toFixed(2)}%`);
    
    try {
      const { rows } = await client.query('SELECT COUNT(*) FROM contractors WHERE state = $1', ['CA']);
      console.log(`🗄️ Total records in DB: ${rows[0].count}`);
    } catch (e) {
      console.warn('Could not get final count');
    }
    
    // Clean up progress file
    try {
      const fs = await import('fs');
      fs.unlinkSync(progressFile);
      console.log('🧹 Progress file cleaned up');
    } catch {}
    
    await client.end();
  });

  parser.on('error', (err) => {
    console.error('❌ CSV parse error:', err);
  });

  csvStream.pipe(parser);
}

main().catch(console.error);