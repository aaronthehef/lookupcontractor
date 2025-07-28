import mysql from 'mysql2/promise';

// PlanetScale connection setup
// 1. Go to https://planetscale.com and create free account
// 2. Create database called "contractors"
// 3. Get connection string from dashboard
// 4. Replace these values with your actual credentials:

const connectionConfig = {
  host: 'YOUR_HOST.psdb.cloud',
  username: 'YOUR_USERNAME', 
  password: 'YOUR_PASSWORD',
  database: 'contractors',
  ssl: {
    rejectUnauthorized: true
  }
};

// Schema creation SQL
const createTableSQL = `
CREATE TABLE IF NOT EXISTS contractors (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  state VARCHAR(2) NOT NULL,
  license_no VARCHAR(50) NOT NULL,
  data_source VARCHAR(20) DEFAULT 'CSLB',
  last_update DATE,
  business_name VARCHAR(255),
  bus_name_2 VARCHAR(255),
  full_business_name VARCHAR(500),
  mailing_address VARCHAR(500),
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
  cb_amount INT,
  wb_surety_company VARCHAR(255),
  wb_number VARCHAR(100),
  wb_effective_date DATE,
  wb_cancellation_date DATE,
  wb_amount INT,
  db_surety_company VARCHAR(255),
  db_number VARCHAR(100),
  db_effective_date DATE,
  db_cancellation_date DATE,
  db_amount INT,
  date_required DATE,
  discp_case_region VARCHAR(100),
  db_bond_reason VARCHAR(255),
  db_case_no VARCHAR(100),
  name_tp_2 VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for performance  
  UNIQUE KEY unique_contractor (state, license_no),
  INDEX idx_business_name (business_name),
  INDEX idx_city (city),
  INDEX idx_primary_classification (primary_classification),
  INDEX idx_primary_status (primary_status),
  INDEX idx_expiration_date (expiration_date)
);`;

async function setupDatabase() {
  try {
    console.log('🔧 Setting up PlanetScale database...');
    
    const connection = await mysql.createConnection(connectionConfig);
    
    console.log('✅ Connected to PlanetScale');
    
    await connection.execute(createTableSQL);
    console.log('✅ Table created successfully');
    
    // Test insert
    const testData = {
      state: 'CA',
      license_no: 'TEST123',
      data_source: 'TEST',
      business_name: 'Test Company'
    };
    
    await connection.execute(
      'INSERT INTO contractors (state, license_no, data_source, business_name) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE business_name = VALUES(business_name)',
      [testData.state, testData.license_no, testData.data_source, testData.business_name]
    );
    
    console.log('✅ Test insert successful');
    
    // Clean up test
    await connection.execute('DELETE FROM contractors WHERE license_no = ?', ['TEST123']);
    console.log('🧹 Test data cleaned up');
    
    await connection.end();
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Run setup if credentials are provided
if (connectionConfig.host !== 'YOUR_HOST.psdb.cloud') {
  setupDatabase();
} else {
  console.log('📋 Setup Instructions:');
  console.log('1. Go to https://planetscale.com');
  console.log('2. Create free account');
  console.log('3. Create database "contractors"');
  console.log('4. Get connection string from dashboard');
  console.log('5. Update connectionConfig in this file');
  console.log('6. Run: npm install mysql2');
  console.log('7. Run: node setup_planetscale.js');
}