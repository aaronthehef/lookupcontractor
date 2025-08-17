// Database Configuration - Supports both Neon PostgreSQL and SQLite
// Uses environment variable USE_SQLITE to switch between databases

const USE_SQLITE = process.env.USE_SQLITE === 'true'

if (USE_SQLITE) {
  // ===== SQLite CONFIGURATION =====
  const path = require('path')

  // SQLite database path
  const DB_PATH = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'contractors.db')

  // Initialize database connection
  let db = null
  let Database = null

  async function initializeDatabase() {
    if (!db) {
      try {
        // Dynamically import better-sqlite3 only when needed
        if (!Database) {
          Database = require('better-sqlite3')
        }
        
        // Ensure directory exists
        const dbDir = path.dirname(DB_PATH)
        require('fs').mkdirSync(dbDir, { recursive: true })
        
        db = new Database(DB_PATH)
        
        // Enable WAL mode for better concurrency
        db.pragma('journal_mode = WAL')
        db.pragma('synchronous = NORMAL')
        db.pragma('cache_size = 1000000')
        db.pragma('temp_store = memory')
        // Make LIKE operations case-insensitive (like PostgreSQL ILIKE)
        db.pragma('case_sensitive_like = false')
        
        console.log(`✅ Connected to SQLite database: ${DB_PATH}`)
        
        // Create tables if they don't exist
        createTables()
        
      } catch (error) {
        console.error('❌ Failed to initialize SQLite database:', error.message)
        if (error.code === 'MODULE_NOT_FOUND') {
          throw new Error('SQLite mode enabled but better-sqlite3 not installed. Please install with: npm install better-sqlite3')
        }
        throw error
      }
    }
    return db
  }

  function createTables() {
    try {
      // Create contractors table with same schema as Neon
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS contractors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          state TEXT NOT NULL,
          license_no TEXT NOT NULL,
          data_source TEXT DEFAULT 'CSLB',
          last_update DATE,
          business_name TEXT,
          bus_name_2 TEXT,
          full_business_name TEXT,
          mailing_address TEXT,
          city TEXT,
          county TEXT,
          zip_code TEXT,
          country TEXT,
          business_phone TEXT,
          business_type TEXT,
          issue_date DATE,
          reissue_date DATE,
          expiration_date DATE,
          inactivation_date DATE,
          reactivation_date DATE,
          pending_suspension TEXT,
          pending_class_removal TEXT,
          pending_class_replace TEXT,
          primary_status TEXT,
          secondary_status TEXT,
          raw_classifications TEXT,
          classification_codes TEXT,
          classification_descriptions TEXT,
          primary_classification TEXT,
          trade TEXT,
          asbestos_reg TEXT,
          workers_comp_coverage_type TEXT,
          wc_insurance_company TEXT,
          wc_policy_number TEXT,
          wc_effective_date DATE,
          wc_expiration_date DATE,
          wc_cancellation_date DATE,
          wc_suspend_date DATE,
          cb_surety_company TEXT,
          cb_number TEXT,
          cb_effective_date DATE,
          cb_cancellation_date DATE,
          cb_amount INTEGER,
          wb_surety_company TEXT,
          wb_number TEXT,
          wb_effective_date DATE,
          wb_cancellation_date DATE,
          wb_amount INTEGER,
          db_surety_company TEXT,
          db_number TEXT,
          db_effective_date DATE,
          db_cancellation_date DATE,
          db_amount INTEGER,
          date_required DATE,
          discp_case_region TEXT,
          db_bond_reason TEXT,
          db_case_no TEXT,
          name_tp_2 TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          
          UNIQUE(state, license_no)
        )
      `
      
      db.exec(createTableSQL)
      
      // Create indexes for performance
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_business_name ON contractors(business_name)',
        'CREATE INDEX IF NOT EXISTS idx_city ON contractors(city)',
        'CREATE INDEX IF NOT EXISTS idx_classification ON contractors(primary_classification)',
        'CREATE INDEX IF NOT EXISTS idx_state_license ON contractors(state, license_no)',
        'CREATE INDEX IF NOT EXISTS idx_status ON contractors(primary_status)',
        'CREATE INDEX IF NOT EXISTS idx_trade ON contractors(trade)',
        'CREATE INDEX IF NOT EXISTS idx_city_state ON contractors(city, state)'
      ]
      
      indexes.forEach(indexSQL => db.exec(indexSQL))
      
    } catch (error) {
      console.error('❌ Failed to create tables:', error.message)
      throw error
    }
  }

  // Execute query with retry logic (PostgreSQL-compatible interface)
  const executeQuery = async (sql, params = [], retries = 2) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const database = await initializeDatabase()
        
        // Convert PostgreSQL parameterized queries ($1, $2) to SQLite (?, ?)
        let sqliteSql = sql
        if (Array.isArray(params) && params.length > 0) {
          for (let i = params.length; i >= 1; i--) {
            sqliteSql = sqliteSql.replace(new RegExp(`\\$${i}`, 'g'), '?')
          }
        }
        
        // Convert PostgreSQL ILIKE to SQLite LIKE (case-insensitive by enabling case_sensitive_like pragma)
        sqliteSql = sqliteSql.replace(/\bILIKE\b/gi, 'LIKE')
        
        if (sqliteSql.trim().toUpperCase().startsWith('SELECT')) {
          // For SELECT queries, return PostgreSQL-compatible format
          const stmt = database.prepare(sqliteSql)
          const rows = params.length > 0 ? stmt.all(...params) : stmt.all()
          return { rows }
        } else {
          // For INSERT/UPDATE/DELETE queries
          const stmt = database.prepare(sqliteSql)
          const result = params.length > 0 ? stmt.run(...params) : stmt.run()
          return { 
            rows: [], 
            rowCount: result.changes,
            insertId: result.lastInsertRowid
          }
        }
        
      } catch (error) {
        console.error(`SQLite query attempt ${attempt + 1} failed:`, error.message)
        
        if (attempt === retries) {
          throw error
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  // Graceful shutdown
  process.on('exit', () => {
    if (db) {
      db.close()
    }
  })

  process.on('SIGINT', () => {
    if (db) {
      db.close()
    }
    process.exit(0)
  })

  module.exports = { 
    pool: { 
      query: executeQuery
    }, 
    executeQuery 
  }

} else {
  // ===== NEON POSTGRESQL CONFIGURATION =====
  const { Pool } = require('pg')

  const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

  // Create a connection pool with proper configuration
  const pool = new Pool({
    connectionString,
    max: 10,                    // Maximum number of connections in the pool
    min: 1,                     // Minimum number of connections in the pool
    idleTimeoutMillis: 30000,   // Close idle connections after 30 seconds
    connectionTimeoutMillis: 10000, // Maximum time to wait for connection (10 seconds)
    query_timeout: 15000,       // Query timeout (15 seconds)
    statement_timeout: 20000,   // Statement timeout (20 seconds)
    keepAlive: true,            // Enable TCP keep-alive
    keepAliveInitialDelayMillis: 10000
  })

  // Handle pool errors with better logging
  pool.on('error', (err) => {
    console.error('Database pool error:', err)
    // Don't exit process, let the pool handle reconnection
  })

  // Handle client connection errors
  pool.on('connect', (client) => {
    client.on('error', (err) => {
      console.error('Database client error:', err)
    })
  })

  // Graceful query execution with retry logic
  const executeQuery = async (text, params, retries = 2) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await pool.query(text, params)
        return result
      } catch (error) {
        console.error(`Query attempt ${attempt + 1} failed:`, error.message)
        
        if (attempt === retries) {
          throw error
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  module.exports = { pool, executeQuery }
}