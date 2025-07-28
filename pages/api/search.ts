import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'pg'

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { searchTerm, searchType } = req.body

  if (!searchTerm || !searchType) {
    return res.status(400).json({ error: 'Missing search parameters' })
  }

  const client = new Client({ connectionString })

  try {
    await client.connect()

    let query: string
    let queryParams: string[]

    switch (searchType) {
      case 'license':
        query = `
          SELECT id, license_no, business_name, city, county, zip_code, 
                 business_phone, primary_status, primary_classification, trade,
                 issue_date, expiration_date, mailing_address
          FROM contractors 
          WHERE state = 'CA' AND license_no ILIKE $1
          ORDER BY license_no
          LIMIT 50
        `
        queryParams = [`%${searchTerm}%`]
        break

      case 'business':
        query = `
          SELECT id, license_no, business_name, city, county, zip_code,
                 business_phone, primary_status, primary_classification, trade,
                 issue_date, expiration_date, mailing_address
          FROM contractors 
          WHERE state = 'CA' AND business_name ILIKE $1
          ORDER BY business_name
          LIMIT 50
        `
        queryParams = [`%${searchTerm}%`]
        break

      case 'city':
        query = `
          SELECT id, license_no, business_name, city, county, zip_code,
                 business_phone, primary_status, primary_classification, trade,
                 issue_date, expiration_date, mailing_address
          FROM contractors 
          WHERE state = 'CA' AND city ILIKE $1
          ORDER BY business_name
          LIMIT 50
        `
        queryParams = [`%${searchTerm}%`]
        break

      case 'classification':
        query = `
          SELECT id, license_no, business_name, city, county, zip_code,
                 business_phone, primary_status, primary_classification, trade,
                 issue_date, expiration_date, mailing_address
          FROM contractors 
          WHERE state = 'CA' AND (
            primary_classification ILIKE $1 OR 
            raw_classifications ILIKE $1 OR
            trade ILIKE $1
          )
          ORDER BY primary_classification, business_name
          LIMIT 50
        `
        queryParams = [`%${searchTerm}%`]
        break

      default:
        return res.status(400).json({ error: 'Invalid search type' })
    }

    const { rows } = await client.query(query, queryParams)

    res.status(200).json({
      contractors: rows,
      count: rows.length
    })

  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database search failed' })
  } finally {
    await client.end()
  }
}