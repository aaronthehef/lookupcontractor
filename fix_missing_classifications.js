import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Complete CSLB Classification Map (same as import_complete.js)
const classificationMap = {
  // General Licenses
  A: "General Engineering Contractor",
  B: "General Building Contractor",
  "B-2": "Residential Remodeling Contractor",
  
  // C-Class Specialty Licenses
  "C-2": "Insulation and Acoustical Contractor", C2: "Insulation and Acoustical Contractor",
  "C-4": "Boiler, Hot Water Heating & Steam Fitting", C4: "Boiler, Hot Water Heating & Steam Fitting",
  "C-5": "Framing and Rough Carpentry", C5: "Framing and Rough Carpentry",
  "C-6": "Cabinet, Millwork and Finish Carpentry", C6: "Cabinet, Millwork and Finish Carpentry",
  "C-7": "Low Voltage Systems", C7: "Low Voltage Systems",
  "C-8": "Concrete", C8: "Concrete",
  "C-9": "Drywall", C9: "Drywall",
  "C-10": "Electrical", C10: "Electrical",
  "C-11": "Elevator", C11: "Elevator",
  "C-12": "Earthwork and Paving", C12: "Earthwork and Paving",
  "C-13": "Fencing", C13: "Fencing",
  "C-15": "Flooring and Floor Covering", C15: "Flooring and Floor Covering",
  "C-16": "Fire Protection", C16: "Fire Protection",
  "C-17": "Glazing", C17: "Glazing",
  "C-20": "Warm-Air Heating, Ventilation, and A/C", C20: "Warm-Air Heating, Ventilation, and A/C",
  "C-21": "Building Moving / Demolition", C21: "Building Moving / Demolition",
  "C-22": "Asbestos Abatement", C22: "Asbestos Abatement",
  "C-23": "Ornamental Metal", C23: "Ornamental Metal",
  "C-27": "Landscaping", C27: "Landscaping",
  "C-28": "Lock and Security Equipment", C28: "Lock and Security Equipment",
  "C-29": "Masonry", C29: "Masonry",
  "C-31": "Construction Zone Traffic Control", C31: "Construction Zone Traffic Control",
  "C-32": "Parking and Highway Improvement", C32: "Parking and Highway Improvement",
  "C-33": "Painting and Decorating", C33: "Painting and Decorating",
  "C-34": "Pipeline", C34: "Pipeline",
  "C-35": "Lathing and Plastering", C35: "Lathing and Plastering",
  "C-36": "Plumbing", C36: "Plumbing",
  "C-38": "Refrigeration", C38: "Refrigeration",
  "C-39": "Roofing", C39: "Roofing",
  "C-42": "Sanitation System", C42: "Sanitation System",
  "C-43": "Sheet Metal", C43: "Sheet Metal",
  "C-45": "Sign", C45: "Sign",
  "C-46": "Solar", C46: "Solar",
  "C-47": "General Manufactured Housing", C47: "General Manufactured Housing",
  "C-49": "Tree and Palm", C49: "Tree and Palm",
  "C-50": "Reinforcing Steel", C50: "Reinforcing Steel",
  "C-51": "Structural Steel", C51: "Structural Steel",
  "C-53": "Swimming Pool", C53: "Swimming Pool",
  "C-54": "Ceramic and Mosaic Tile", C54: "Ceramic and Mosaic Tile",
  "C-55": "Water Conditioning", C55: "Water Conditioning",
  "C-57": "Well Drilling", C57: "Well Drilling",
  "C-60": "Welding", C60: "Welding",
  "C-61": "Limited Specialty", C61: "Limited Specialty",
  
  // Active D-Subcategories
  "D-3": "Awnings", D3: "Awnings", D03: "Awnings",
  "D-4": "Central Vacuum Systems", D4: "Central Vacuum Systems", D04: "Central Vacuum Systems",
  "D-6": "Concrete-Related Services", D6: "Concrete-Related Services", D06: "Concrete-Related Services",
  "D-9": "Drilling, Blasting & Oil Field Work", D9: "Drilling, Blasting & Oil Field Work", D09: "Drilling, Blasting & Oil Field Work",
  "D-10": "Elevated Floors", D10: "Elevated Floors", D010: "Elevated Floors",
  "D-12": "Synthetic Products", D12: "Synthetic Products", D012: "Synthetic Products",
  "D-16": "Hardware, Locks & Safes", D16: "Hardware, Locks & Safes", D016: "Hardware, Locks & Safes",
  "D-21": "Machinery & Pumps", D21: "Machinery & Pumps", D021: "Machinery & Pumps",
  "D-24": "Metal Products", D24: "Metal Products", D024: "Metal Products",
  "D-28": "Doors, Gates & Activating Devices", D28: "Doors, Gates & Activating Devices", D028: "Doors, Gates & Activating Devices",
  "D-29": "Paperhanging", D29: "Paperhanging", D029: "Paperhanging",
  "D-30": "Pile Driving & Pressure Foundation Jacking", D30: "Pile Driving & Pressure Foundation Jacking", D030: "Pile Driving & Pressure Foundation Jacking",
  "D-31": "Pole Installation & Maintenance", D31: "Pole Installation & Maintenance", D031: "Pole Installation & Maintenance",
  "D-34": "Prefabricated Equipment", D34: "Prefabricated Equipment", D034: "Prefabricated Equipment",
  "D-35": "Pool & Spa Maintenance", D35: "Pool & Spa Maintenance", D035: "Pool & Spa Maintenance",
  "D-38": "Sand & Water Blasting", D38: "Sand & Water Blasting", D038: "Sand & Water Blasting",
  "D-39": "Scaffolding", D39: "Scaffolding", D039: "Scaffolding",
  "D-40": "Service Station Equipment & Maintenance", D40: "Service Station Equipment & Maintenance", D040: "Service Station Equipment & Maintenance",
  "D-41": "Siding & Decking", D41: "Siding & Decking", D041: "Siding & Decking",
  "D-42": "Non-Electrical Sign Installation", D42: "Non-Electrical Sign Installation", D042: "Non-Electrical Sign Installation",
  "D-49": "Tree Service", D49: "Tree Service", D049: "Tree Service",
  "D-50": "Suspended Ceilings", D50: "Suspended Ceilings", D050: "Suspended Ceilings",
  "D-52": "Window Coverings", D52: "Window Coverings", D052: "Window Coverings",
  "D-53": "Wood Tanks", D53: "Wood Tanks", D053: "Wood Tanks",
  "D-56": "Trenching Only", D56: "Trenching Only", D056: "Trenching Only",
  "D-59": "Hydroseed Spraying", D59: "Hydroseed Spraying", D059: "Hydroseed Spraying",
  "D-62": "Air & Water Balancing", D62: "Air & Water Balancing", D062: "Air & Water Balancing",
  "D-63": "Construction Clean-up", D63: "Construction Clean-up", D063: "Construction Clean-up",
  "D-64": "Non-Specialized", D64: "Non-Specialized", D064: "Non-Specialized",
  "D-65": "Weatherization & Energy Conservation", D65: "Weatherization & Energy Conservation", D065: "Weatherization & Energy Conservation",
  
  // Certifications
  ASB: "Asbestos Certification",
  HAZ: "Hazardous Substance Removal Certification"
};

// Re-parse classification function (improved version)
function parseClassifications(classificationString) {
  if (!classificationString) return { 
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
      // Handle D-codes without dashes (D06 -> D-6, D03 -> D-3, etc.)
      if (code.match(/^D0?\d+$/)) {
        const num = code.replace('D0', '').replace('D', '');
        return `D-${num}`;
      }
      
      // Handle C-codes without dashes  
      if (code.match(/^C\d+$/)) {
        const num = code.substring(1);
        if (parseInt(num) >= 10) {
          return `C-${num}`;
        }
      }
      
      return code;
    })
    .filter((code, index, array) => array.indexOf(code) === index); // Remove duplicates

  if (codes.length === 0) {
    return {
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
    classification_codes: codes.length > 0 ? codes.join(', ') : null,
    classification_descriptions: descriptions.length > 0 ? descriptions.join(', ') : null,
    primary_classification: primaryClassification,
    primary_trade: primaryTrade
  };
}

async function fixMissingClassifications() {
  console.log('🔧 Starting classification repair...');
  
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    // Get all records that need fixing
    console.log('📋 Fetching records that need classification updates...');
    const { rows: recordsToFix } = await client.query(`
      SELECT id, license_no, raw_classifications, primary_classification, trade
      FROM contractors 
      WHERE raw_classifications IS NOT NULL 
        AND raw_classifications != ''
        AND (
          primary_classification IS NULL OR 
          primary_classification = '' OR
          trade IS NULL OR 
          trade = ''
        )
      ORDER BY id
    `);
    
    console.log(`📊 Found ${recordsToFix.length} records to fix`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < recordsToFix.length; i++) {
      const record = recordsToFix[i];
      
      try {
        // Re-parse the classification
        const parsed = parseClassifications(record.raw_classifications);
        
        // Update the record if we got better data
        if (parsed.primary_classification || parsed.primary_trade) {
          await client.query(`
            UPDATE contractors 
            SET 
              classification_codes = $1,
              classification_descriptions = $2,
              primary_classification = COALESCE($3, primary_classification),
              trade = COALESCE($4, trade),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
          `, [
            parsed.classification_codes,
            parsed.classification_descriptions,
            parsed.primary_classification,
            parsed.primary_trade,
            record.id
          ]);
          
          fixedCount++;
          
          if (i < 10) {
            console.log(`✅ Fixed ${record.license_no}: "${record.raw_classifications}" -> ${parsed.primary_classification} (${parsed.primary_trade})`);
          }
        }
        
        if ((i + 1) % 1000 === 0) {
          console.log(`📊 Progress: ${i + 1}/${recordsToFix.length} processed, ${fixedCount} fixed`);
        }
        
      } catch (error) {
        errorCount++;
        if (errorCount <= 10) {
          console.error(`❌ Error fixing record ${record.license_no}: ${error.message}`);
        }
      }
    }
    
    console.log('\n🎉 Classification repair complete!');
    console.log(`✅ Records fixed: ${fixedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Show updated statistics
    console.log('\n📊 Updated statistics:');
    const { rows: newStats } = await client.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(primary_classification) as has_primary_classification,
        COUNT(trade) as has_trade,
        COUNT(*) - COUNT(primary_classification) as missing_primary,
        COUNT(*) - COUNT(trade) as missing_trade
      FROM contractors
    `);
    
    const stats = newStats[0];
    console.log(`  Total records: ${stats.total_records}`);
    console.log(`  Has primary_classification: ${stats.has_primary_classification}`);
    console.log(`  Has trade: ${stats.has_trade}`);
    console.log(`  Missing primary_classification: ${stats.missing_primary}`);
    console.log(`  Missing trade: ${stats.missing_trade}`);
    
  } finally {
    await client.end();
  }
}

fixMissingClassifications().catch(console.error);