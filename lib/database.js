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