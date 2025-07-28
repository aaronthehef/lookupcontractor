import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function checkSchema() {
  const client = new Client({ connectionString });
  await client.connect();
  
  // Get actual column names and count
  const { rows } = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'contractors' 
    ORDER BY ordinal_position
  `);
  
  console.log('📋 Actual table columns:');
  rows.forEach((row, index) => {
    console.log(`${index + 1}. ${row.column_name} (${row.data_type})`);
  });
  
  console.log(`\n📊 Total columns: ${rows.length}`);
  
  await client.end();
}

checkSchema().catch(console.error);