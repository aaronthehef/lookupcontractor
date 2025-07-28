import { createReadStream, createWriteStream } from 'fs';
import { parse } from 'csv-parse';

console.log('🚀 Running in OFFLINE mode - saving to JSON files instead of database');

const classificationMap = {
  A: "General Engineering Contractor",
  B: "General Building Contractor",
  "B-2": "Residential Remodeling Contractor",
  "C-10": "Electrical Contractor",
  C10: "Electrical Contractor",
  "C-36": "Plumbing Contractor",
  C36: "Plumbing Contractor",
  "C-57": "Well Drilling Contractor",
  C57: "Well Drilling Contractor",
  // Add more as needed
};

function normalizeKeys(obj) {
  const normalized = {};
  for (const key in obj) {
    let trimmedKey = key.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
    const normalizedKey = trimmedKey.toLowerCase().replace(/[\s\(\)-]+/g, '').replace(/_+/g, '');
    normalized[normalizedKey] = obj[key];
  }
  return normalized;
}

function parseClassifications(classificationString) {
  if (!classificationString) return { raw_classifications: null, primary_classification: null };
  
  const codes = classificationString.split(/[\|\s,;]+/).map(code => code.trim().toUpperCase()).filter(Boolean);
  
  return {
    raw_classifications: classificationString,
    classification_codes: codes.join(', '),
    primary_classification: codes[0] || null,
    primary_trade: classificationMap[codes[0]] || null
  };
}

function mapRow(row, rowNumber) {
  if (!row.licenseno || row.licenseno.trim() === '') {
    throw new Error(`Missing license_no at row ${rowNumber}`);
  }

  const classificationData = parseClassifications(row.classificationss);

  return {
    state: 'CA',
    license_no: row.licenseno?.trim(),
    business_name: row.businessname?.trim(),
    city: row.city?.trim(),
    primary_classification: classificationData.primary_classification,
    primary_trade: classificationData.primary_trade,
    raw_classifications: classificationData.raw_classifications,
    row_number: rowNumber
  };
}

async function main() {
  let processedCount = 0;
  let batch = [];
  const outputFile = createWriteStream('./processed_contractors.json');
  outputFile.write('[\n');

  const csvStream = createReadStream('./cslb_master_list.csv');
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  parser.on('data', (row) => {
    processedCount++;
    
    try {
      const normRow = normalizeKeys(row);
      const mappedRow = mapRow(normRow, processedCount);
      
      if (batch.length > 0) outputFile.write(',\n');
      outputFile.write(JSON.stringify(mappedRow, null, 2));
      batch.push(mappedRow);
      
      if (processedCount % 1000 === 0) {
        console.log(`📖 Processed ${processedCount} rows`);
      }
      
    } catch (error) {
      console.error(`❌ Row ${processedCount} skipped: ${error.message}`);
    }
  });

  parser.on('end', () => {
    outputFile.write('\n]');
    outputFile.end();
    console.log(`✅ Processed ${processedCount} total rows`);
    console.log(`📄 Data saved to: processed_contractors.json`);
  });

  parser.on('error', (err) => {
    console.error('❌ CSV parse error:', err);
  });

  csvStream.pipe(parser);
}

main().catch(console.error);