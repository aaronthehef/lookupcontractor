// API endpoint to return database status
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const useSqliteRaw = process.env.USE_SQLITE
    const isUsingSQLite = process.env.USE_SQLITE?.trim() === 'true'
    const oracleApiUrl = process.env.ORACLE_DB_API_URL || 'Not set'
    
    res.status(200).json({
      database_type: isUsingSQLite ? 'Oracle SQLite' : 'Neon PostgreSQL',
      using_sqlite: isUsingSQLite,
      oracle_api_url: isUsingSQLite ? oracleApiUrl : null,
      timestamp: new Date().toISOString(),
      debug: {
        USE_SQLITE_raw: useSqliteRaw,
        USE_SQLITE_type: typeof useSqliteRaw,
        all_env_vars: Object.keys(process.env).filter(key => key.includes('SQLITE') || key.includes('ORACLE'))
      }
    })

  } catch (error) {
    res.status(500).json({ error: 'Failed to get database status' })
  }
}