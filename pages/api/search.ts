import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'pg'

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { searchTerm, searchType, city, state } = req.body

  if (!searchTerm || !searchType) {
    return res.status(400).json({ error: 'Missing search parameters' })
  }

  const client = new Client({ connectionString })

  try {
    await client.connect()

    // Build dynamic WHERE clause
    let whereConditions = [`state = 'CA'`]
    let queryParams: string[] = []
    let paramIndex = 1

    // Add search type specific condition
    switch (searchType) {
      case 'license':
        whereConditions.push(`license_no ILIKE $${paramIndex}`)
        queryParams.push(`%${searchTerm}%`)
        paramIndex++
        break

      case 'business':
        whereConditions.push(`business_name ILIKE $${paramIndex}`)
        queryParams.push(`%${searchTerm}%`)
        paramIndex++
        break

      case 'city':
        whereConditions.push(`city ILIKE $${paramIndex}`)
        queryParams.push(`%${searchTerm}%`)
        paramIndex++
        break

      case 'classification':
        whereConditions.push(`(
          primary_classification ILIKE $${paramIndex} OR 
          raw_classifications ILIKE $${paramIndex} OR
          trade ILIKE $${paramIndex}
        )`)
        queryParams.push(`%${searchTerm}%`)
        paramIndex++
        break

      default:
        return res.status(400).json({ error: 'Invalid search type' })
    }

    // Add city filter if provided and not already searching by city
    if (city && searchType !== 'city') {
      whereConditions.push(`city ILIKE $${paramIndex}`)
      queryParams.push(`%${city}%`)
      paramIndex++
    }

    // Add state filter if provided (currently only CA supported)
    if (state && state.toLowerCase() !== 'california') {
      // For now, only California is supported
      return res.status(400).json({ error: 'Only California contractors are currently available' })
    }

    const query = `
      SELECT id, license_no, business_name, city, county, zip_code,
             business_phone, primary_status, primary_classification, trade,
             issue_date, expiration_date, mailing_address
      FROM contractors 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${searchType === 'license' ? 'license_no' : 
                 searchType === 'classification' ? 'primary_classification, business_name' : 
                 'business_name'}
    `

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