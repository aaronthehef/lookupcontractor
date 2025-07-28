import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function findUnknownCodes() {
  console.log('🔍 Finding unknown/missing classification codes...');
  
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    // Get all unique individual classification codes from raw_classifications
    const { rows } = await client.query(`
      WITH split_codes AS (
        SELECT 
          TRIM(UPPER(regexp_split_to_table(raw_classifications, '[|\\s,;]+'))) as code
        FROM contractors 
        WHERE raw_classifications IS NOT NULL 
          AND raw_classifications != ''
      )
      SELECT code, COUNT(*) as usage_count
      FROM split_codes 
      WHERE code != '' 
        AND code IS NOT NULL
      GROUP BY code
      ORDER BY code
    `);
    
    // Classification codes we know about
    const knownCodes = new Set([
      'A', 'B', 'B-2',
      'C-2', 'C2', 'C-4', 'C4', 'C-5', 'C5', 'C-6', 'C6', 'C-7', 'C7', 'C-8', 'C8', 'C-9', 'C9',
      'C-10', 'C10', 'C-11', 'C11', 'C-12', 'C12', 'C-13', 'C13', 'C-15', 'C15', 'C-16', 'C16',
      'C-17', 'C17', 'C-20', 'C20', 'C-21', 'C21', 'C-22', 'C22', 'C-23', 'C23', 'C-27', 'C27',
      'C-28', 'C28', 'C-29', 'C29', 'C-31', 'C31', 'C-32', 'C32', 'C-33', 'C33', 'C-34', 'C34',
      'C-35', 'C35', 'C-36', 'C36', 'C-38', 'C38', 'C-39', 'C39', 'C-42', 'C42', 'C-43', 'C43',
      'C-45', 'C45', 'C-46', 'C46', 'C-47', 'C47', 'C-49', 'C49', 'C-50', 'C50', 'C-51', 'C51',
      'C-53', 'C53', 'C-54', 'C54', 'C-55', 'C55', 'C-57', 'C57', 'C-60', 'C60', 'C-61', 'C61',
      'D-3', 'D3', 'D03', 'D-4', 'D4', 'D04', 'D-6', 'D6', 'D06', 'D-9', 'D9', 'D09',
      'D-10', 'D10', 'D010', 'D-12', 'D12', 'D012', 'D-16', 'D16', 'D016', 'D-21', 'D21', 'D021',
      'D-24', 'D24', 'D024', 'D-28', 'D28', 'D028', 'D-29', 'D29', 'D029', 'D-30', 'D30', 'D030',
      'D-31', 'D31', 'D031', 'D-34', 'D34', 'D034', 'D-35', 'D35', 'D035', 'D-38', 'D38', 'D038',
      'D-39', 'D39', 'D039', 'D-40', 'D40', 'D040', 'D-41', 'D41', 'D041', 'D-42', 'D42', 'D042',
      'D-49', 'D49', 'D049', 'D-50', 'D50', 'D050', 'D-52', 'D52', 'D052', 'D-53', 'D53', 'D053',
      'D-56', 'D56', 'D056', 'D-59', 'D59', 'D059', 'D-62', 'D62', 'D062', 'D-63', 'D63', 'D063',
      'D-64', 'D64', 'D064', 'D-65', 'D65', 'D065',
      // Legacy/Obsolete D codes
      'D-1', 'D1', 'D01', 'D-2', 'D2', 'D02', 'D-5', 'D5', 'D05', 'D-7', 'D7', 'D07',
      'D-8', 'D8', 'D08', 'D-11', 'D11', 'D011', 'D-13', 'D13', 'D013', 'D-14', 'D14', 'D014',
      'D-15', 'D15', 'D015', 'D-17', 'D17', 'D017', 'D-19', 'D19', 'D019', 'D-20', 'D20', 'D020',
      'D-22', 'D22', 'D022', 'D-23', 'D23', 'D023', 'D-25', 'D25', 'D025', 'D-26', 'D26', 'D026',
      'D-27', 'D27', 'D027', 'D-32', 'D32', 'D032', 'D-33', 'D33', 'D033', 'D-36', 'D36', 'D036',
      'D-37', 'D37', 'D037', 'D-43', 'D43', 'D043', 'D-44', 'D44', 'D044', 'D-45', 'D45', 'D045',
      'D-46', 'D46', 'D046', 'D-47', 'D47', 'D047', 'D-48', 'D48', 'D048', 'D-51', 'D51', 'D051',
      'D-54', 'D54', 'D054', 'D-55', 'D55', 'D055', 'D-57', 'D57', 'D057', 'D-58', 'D58', 'D058',
      'D-60', 'D60', 'D060', 'D-61', 'D61', 'D061',
      'ASB', 'HAZ'
    ]);
    
    console.log('\n📋 Unknown/Missing Classification Codes:\n');
    
    const unknownCodes = [];
    rows.forEach(row => {
      if (!knownCodes.has(row.code)) {
        unknownCodes.push(row.code);
        console.log(`  ${row.code} (used ${row.usage_count} times)`);
      }
    });
    
    console.log(`\n📊 Total unknown codes found: ${unknownCodes.length}`);
    console.log(`📊 Total unique codes in database: ${rows.length}`);
    
    if (unknownCodes.length > 0) {
      console.log('\n🔍 Unknown codes list (copy-paste ready):');
      console.log(unknownCodes.join(', '));
    } else {
      console.log('\n✅ All classification codes are known!');
    }
    
  } finally {
    await client.end();
  }
}

findUnknownCodes().catch(console.error);