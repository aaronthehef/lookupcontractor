import pkg from 'pg';
const { Client } = pkg;

// Neon setup instructions:
// 1. Go to https://neon.tech
// 2. Sign up (free, no credit card)
// 3. Create database
// 4. Copy connection string here:

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Same schema as Supabase for easy migration
const createTableSQL = `
CREATE TABLE IF NOT EXISTS contractors (
  id SERIAL PRIMARY KEY,
  state VARCHAR(2) NOT NULL,
  license_no VARCHAR(50) NOT NULL,
  data_source VARCHAR(20) DEFAULT 'CSLB',
  last_update DATE,
  business_name VARCHAR(255),
  bus_name_2 VARCHAR(255),
  full_business_name TEXT,
  mailing_address TEXT,
  city VARCHAR(100),
  county VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(50),
  business_phone VARCHAR(50),
  business_type VARCHAR(100),
  issue_date DATE,
  reissue_date DATE,
  expiration_date DATE,
  inactivation_date DATE,
  reactivation_date DATE,
  pending_suspension VARCHAR(10),
  pending_class_removal VARCHAR(10),
  pending_class_replace VARCHAR(10),
  primary_status VARCHAR(50),
  secondary_status VARCHAR(50),
  raw_classifications TEXT,
  classification_codes TEXT,
  classification_descriptions TEXT,
  primary_classification VARCHAR(20),
  trade VARCHAR(255),
  asbestos_reg VARCHAR(10),
  workers_comp_coverage_type VARCHAR(100),
  wc_insurance_company VARCHAR(255),
  wc_policy_number VARCHAR(100),
  wc_effective_date DATE,
  wc_expiration_date DATE,
  wc_cancellation_date DATE,
  wc_suspend_date DATE,
  cb_surety_company VARCHAR(255),
  cb_number VARCHAR(100),
  cb_effective_date DATE,
  cb_cancellation_date DATE,
  cb_amount INTEGER,
  wb_surety_company VARCHAR(255),
  wb_number VARCHAR(100),
  wb_effective_date DATE,
  wb_cancellation_date DATE,
  wb_amount INTEGER,
  db_surety_company VARCHAR(255),
  db_number VARCHAR(100),
  db_effective_date DATE,
  db_cancellation_date DATE,
  db_amount INTEGER,
  date_required DATE,
  discp_case_region VARCHAR(100),
  db_bond_reason VARCHAR(255),
  db_case_no VARCHAR(100),
  name_tp_2 VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(state, license_no)
);

CREATE INDEX IF NOT EXISTS idx_business_name ON contractors(business_name);
CREATE INDEX IF NOT EXISTS idx_city ON contractors(city);
CREATE INDEX IF NOT EXISTS idx_classification ON contractors(primary_classification);
`;

async function setupNeon() {
  if (connectionString === 'postgresql://username:password@your-host.neon.tech/dbname?sslmode=require') {
    console.log('📋 Neon Setup Instructions:');
    console.log('1. Go to https://neon.tech');
    console.log('2. Sign up (free, no credit card required)');
    console.log('3. Create new project');
    console.log('4. Copy connection string');
    console.log('5. Update connectionString in this file');
    console.log('6. Run: npm install pg');
    console.log('7. Run: node setup_neon.js');
    return;
  }

  try {
    console.log('🔧 Setting up Neon database...');
    
    const client = new Client({ connectionString });
    await client.connect();
    
    console.log('✅ Connected to Neon');
    
    await client.query(createTableSQL);
    console.log('✅ Table and indexes created');
    
    // Test insert
    await client.query(
      `INSERT INTO contractors (state, license_no, data_source, business_name) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (state, license_no) DO UPDATE SET business_name = EXCLUDED.business_name`,
      ['CA', 'TEST123', 'TEST', 'Test Company']
    );
    
    console.log('✅ Test insert successful');
    
    // Clean up
    await client.query('DELETE FROM contractors WHERE license_no = $1', ['TEST123']);
    console.log('🧹 Test data cleaned up');
    
    await client.end();
    console.log('🎉 Neon setup complete!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupNeon();