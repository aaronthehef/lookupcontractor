import { createReadStream } from 'fs';
import { parse } from 'csv-parse';

console.log('🔍 Testing CSV file format...');

let rowCount = 0;
let headersSeen = false;

createReadStream('./cslb_master_list.csv')
  .pipe(parse({ 
    columns: false,  // Don't parse headers yet
    skip_empty_lines: true,
    relax_column_count: true,
    quote: '"',
    delimiter: ',',
    escape: '"'
  }))
  .on('data', (row) => {
    rowCount++;
    
    if (rowCount === 1) {
      console.log('📋 Headers found:', row.length, 'columns');
      console.log('📋 First 10 headers:', row.slice(0, 10));
      headersSeen = true;
    } else if (rowCount === 2) {
      console.log('📊 First data row:', row.length, 'columns');
      console.log('📊 First 5 values:', row.slice(0, 5));
    }
    
    // Stop after checking first few rows
    if (rowCount >= 5) {
      console.log(`✅ CSV appears to be working. Found ${rowCount} rows so far.`);
      process.exit(0);
    }
  })
  .on('end', () => {
    console.log(`✅ CSV parsing complete. Total rows: ${rowCount}`);
  })
  .on('error', (error) => {
    console.error('❌ CSV error:', error);
  });

// Timeout in case it hangs
setTimeout(() => {
  if (rowCount === 0) {
    console.error('❌ No data received after 10 seconds. File might be corrupt or have encoding issues.');
    process.exit(1);
  }
}, 10000);