// Simple HTTP API server for SQLite database on Oracle server
// This will run on the Oracle server and serve database queries via HTTP

const http = require('http')
const url = require('url')
const path = require('path')
const Database = require('better-sqlite3')

const PORT = process.env.PORT || 3001
const DB_PATH = '/home/ubuntu/lookupcontractor/data/contractors.db'

console.log('🚀 Starting Oracle SQLite API Server...')

// Initialize SQLite database
let db
try {
  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
  db.pragma('cache_size = 1000000')
  db.pragma('case_sensitive_like = false')
  console.log(`✅ Connected to SQLite database: ${DB_PATH}`)
} catch (error) {
  console.error('❌ Failed to connect to SQLite database:', error.message)
  process.exit(1)
}

// CORS headers for Vercel requests
const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

// Execute query with PostgreSQL compatibility
const executeQuery = (sql, params = []) => {
  try {
    // Convert PostgreSQL parameterized queries ($1, $2) to SQLite (?, ?)
    let sqliteSql = sql
    if (Array.isArray(params) && params.length > 0) {
      for (let i = params.length; i >= 1; i--) {
        sqliteSql = sqliteSql.replace(new RegExp(`\\$${i}`, 'g'), '?')
      }
    }
    
    // Convert PostgreSQL ILIKE to SQLite LIKE
    sqliteSql = sqliteSql.replace(/\bILIKE\b/gi, 'LIKE')
    
    if (sqliteSql.trim().toUpperCase().startsWith('SELECT')) {
      // For SELECT queries
      const stmt = db.prepare(sqliteSql)
      const rows = params.length > 0 ? stmt.all(...params) : stmt.all()
      return { rows, success: true }
    } else {
      // For INSERT/UPDATE/DELETE queries
      const stmt = db.prepare(sqliteSql)
      const result = params.length > 0 ? stmt.run(...params) : stmt.run()
      return { 
        rows: [], 
        rowCount: result.changes,
        insertId: result.lastInsertRowid,
        success: true
      }
    }
  } catch (error) {
    console.error('Database query error:', error.message)
    return { 
      success: false, 
      error: error.message,
      sql: sql,
      params: params 
    }
  }
}

// HTTP server
const server = http.createServer((req, res) => {
  setCORSHeaders(res)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname

  // Health check endpoint
  if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    }))
    return
  }

  // Database stats endpoint
  if (pathname === '/stats' && req.method === 'GET') {
    try {
      const totalResult = executeQuery('SELECT COUNT(*) as total FROM contractors')
      const activeResult = executeQuery("SELECT COUNT(*) as active FROM contractors WHERE primary_status = 'CLEAR'")
      
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        total_contractors: totalResult.rows[0]?.total || 0,
        active_contractors: activeResult.rows[0]?.active || 0,
        database_path: DB_PATH,
        timestamp: new Date().toISOString()
      }))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Failed to get database stats', details: error.message }))
    }
    return
  }

  // Main query endpoint
  if (pathname === '/query' && req.method === 'POST') {
    let body = ''
    
    req.on('data', chunk => {
      body += chunk.toString()
    })
    
    req.on('end', () => {
      try {
        const { sql, params = [] } = JSON.parse(body)
        
        if (!sql) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'SQL query is required' }))
          return
        }

        console.log(`📊 Executing query: ${sql.substring(0, 100)}...`)
        console.log(`📋 Parameters: ${JSON.stringify(params)}`)
        
        const result = executeQuery(sql, params)
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
        
      } catch (error) {
        console.error('Request processing error:', error.message)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ 
          error: 'Failed to process request', 
          details: error.message 
        }))
      }
    })
    return
  }

  // 404 for unknown endpoints
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Endpoint not found' }))
})

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Oracle SQLite API Server running on port ${PORT}`)
  console.log(`📍 Database: ${DB_PATH}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log(`📊 Stats: http://localhost:${PORT}/stats`)
  console.log(`💾 Query endpoint: http://localhost:${PORT}/query`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Oracle SQLite API Server...')
  if (db) {
    db.close()
    console.log('✅ Database connection closed')
  }
  server.close(() => {
    console.log('✅ Server stopped')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...')
  if (db) {
    db.close()
  }
  server.close(() => {
    process.exit(0)
  })
})