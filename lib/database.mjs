// ES6 Module version of database.js for sitemap generation
// Database Configuration - Supports both Neon PostgreSQL and SQLite
// Uses environment variable USE_SQLITE to switch between databases

const USE_SQLITE = process.env.USE_SQLITE?.trim() === 'true'

let executeQuery, pool

if (USE_SQLITE) {
  // ===== ORACLE SQLITE HTTP API CONFIGURATION =====
  const ORACLE_DB_API_URL = process.env.ORACLE_DB_API_URL?.trim() || 'http://168.138.65.108:3001'

  console.log(`🔗 Using Oracle SQLite API: ${ORACLE_DB_API_URL}`)

  // Execute query via HTTP API to Oracle server
  executeQuery = async (sql, params = [], retries = 2) => {
    const fetch = (await import('node-fetch')).default
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`🔍 Oracle SQLite query attempt ${attempt + 1}: ${sql.substring(0, 50)}...`)
        
        const response = await fetch(`${ORACLE_DB_API_URL}/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql, params })
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Database query failed')
        }

        console.log(`✅ Oracle SQLite query successful: ${result.rows.length} rows`)
        return { rows: result.rows, rowCount: result.rowCount }
        
      } catch (error) {
        console.error(`Oracle SQLite query attempt ${attempt + 1} failed:`, error.message)
        
        if (attempt === retries) {
          throw error
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  pool = { 
    query: executeQuery
  }

} else {
  // ===== NEON POSTGRESQL CONFIGURATION =====
  const pgModule = await import('pg')
  const { Pool } = pgModule.default

  const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

  // Create a connection pool with proper configuration
  pool = new Pool({
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
  executeQuery = async (text, params, retries = 2) => {
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
}

export { executeQuery, pool }