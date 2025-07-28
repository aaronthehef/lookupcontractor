import { createReadStream, createWriteStream } from 'fs';
import { parse } from 'csv-parse';
import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Classification mapping (simplified)
const classificationMap = {
  A: "General Engineering Contractor",
  B: "General Building Contractor",
  "B-2": "Residential Remodeling Contractor",
  "C-10": "Electrical Contractor", C10: "Electrical Contractor",
  "C-36": "Plumbing Contractor", C36: "Plumbing Contractor", 
  "C-57": "Well Drilling Contractor", C57: "Well Drilling Contractor",
  "C-6": "Cabinet, Millwork and Finish Carpentry Contractor", C6: "Cabinet, Millwork and Finish Carpentry Contractor",
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
  if (!classificationString) return { raw_classifications: null, primary_classification: null, primary_trade: null };
  
  const codes = classificationString.split(/[\|\s,;]+/).map(code => code.trim().toUpperCase()).filter(Boolean);
  const primaryCode = codes[0] || null;
  
  return {
    raw_classifications: classificationString,
    primary_classification: primaryCode,
    primary_trade: classificationMap[primaryCode] || null
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

async function main() {
  console.log('🚀 Starting simple CSV import to Neon...');

  const client = new Client({ connectionString });
  await client.connect();
  console.log('✅ Connected to Neon database');

  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;

  const csvStream = createReadStream('./cslb_master_list.csv');
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    relax_quotes: true,
  });

  parser.on('data', async (row) => {
    processedCount++;
    
    try {
      const normRow = normalizeKeys(row);
      
      if (!normRow.licenseno || !normRow.licenseno.trim()) {
        errorCount++;
        return;
      }

      const classificationData = parseClassifications(normRow.classificationss);
      
      if (processedCount <= 10) {
        console.log(`🔍 Row ${processedCount}: ${normRow.licenseno} - ${classificationData.raw_classifications}`);
      }

      // Simple insert with just key fields
      await client.query(`
        INSERT INTO contractors (
          state, license_no, data_source, business_name, city, 
          raw_classifications, primary_classification, trade
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (state, license_no) DO UPDATE SET
          business_name = EXCLUDED.business_name,
          raw_classifications = EXCLUDED.raw_classifications,
          primary_classification = EXCLUDED.primary_classification,
          trade = EXCLUDED.trade,
          updated_at = CURRENT_TIMESTAMP
      `, [
        'CA',
        cleanString(normRow.licenseno),
        'CSLB',
        cleanString(normRow.businessname),
        cleanString(normRow.city),
        classificationData.raw_classifications,
        classificationData.primary_classification,
        classificationData.primary_trade
      ]);

      successCount++;
      
      if (processedCount % 1000 === 0) {
        console.log(`📊 Processed ${processedCount} rows, ${successCount} successful`);
      }
      
    } catch (error) {
      errorCount++;
      if (errorCount <= 10) {
        console.error(`❌ Row ${processedCount} failed: ${error.message}`);
      }
    }
  });

  parser.on('end', async () => {
    console.log('\n🎉 Import complete!');
    console.log(`📖 Total rows processed: ${processedCount}`);
    console.log(`✅ Successful inserts: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    try {
      const { rows } = await client.query('SELECT COUNT(*) FROM contractors WHERE state = $1', ['CA']);
      console.log(`🗄️ Total records in DB: ${rows[0].count}`);
    } catch (e) {
      console.warn('Could not get final count');
    }
    
    await client.end();
  });

  parser.on('error', (err) => {
    console.error('❌ CSV parse error:', err);
  });

  csvStream.pipe(parser);
}

main().catch(console.error);