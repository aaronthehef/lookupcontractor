import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'pg'

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const client = new Client({ connectionString })

  try {
    await client.connect()

    const { rows } = await client.query(`
      SELECT 
        city,
        county,
        COUNT(*) as count
      FROM contractors 
      WHERE state = 'CA' 
        AND city IS NOT NULL 
        AND city != ''
      GROUP BY city, county
      HAVING COUNT(*) >= 5
      ORDER BY count DESC, city ASC
      LIMIT 200
    `)

    res.status(200).json({
      cities: rows.map(row => ({
        city: row.city,
        county: row.county,
        count: parseInt(row.count)
      }))
    })

  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database query failed' })
  } finally {
    await client.end()
  }
}