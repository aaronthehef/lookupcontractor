import { Pool } from 'pg'

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

// Create a connection pool
const pool = new Pool({
  connectionString,
  max: 20,        // Maximum number of connections in the pool
  min: 2,         // Minimum number of connections in the pool
  idle: 10000,    // Close idle connections after 10 seconds
  acquire: 30000, // Maximum time to wait for connection (30 seconds)
  create: 30000   // Maximum time to wait for connection creation (30 seconds)
})

// Handle pool errors
pool.on('error', (err) => {
  console.error('Database pool error:', err)
})

export default pool