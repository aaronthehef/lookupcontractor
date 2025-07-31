import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'pg'

const connectionString = 'postgresql://neondb_owner:npg_s3DtWl7xbHgZ@ep-weathered-night-ae14rq4j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { 
    state, 
    city, 
    type, 
    term, 
    page = '1', 
    limit = '20' 
  } = req.query

  const offset = (parseInt(page as string) - 1) * parseInt(limit as string)

  const client = new Client({ connectionString })

  try {
    await client.connect()

    // Build WHERE clause conditions
    let whereConditions = []
    let queryParams = []
    let paramIndex = 1

    // State filter (required)
    if (state) {
      whereConditions.push(`state = $${paramIndex}`)
      queryParams.push(state)
      paramIndex++
    }

    // City filter
    if (city) {
      whereConditions.push(`LOWER(city) = LOWER($${paramIndex})`)
      queryParams.push(city)
      paramIndex++
    }

    // Contractor type filter
    if (type) {
      whereConditions.push(`(primary_classification = $${paramIndex} OR classification_codes LIKE '%' || $${paramIndex} || '%')`)
      queryParams.push(type)
      paramIndex++
    }

    // Search term filter
    if (term) {
      const searchTerm = `%${term}%`
      whereConditions.push(`(
        LOWER(business_name) LIKE LOWER($${paramIndex}) OR 
        LOWER(full_business_name) LIKE LOWER($${paramIndex}) OR 
        license_no LIKE UPPER($${paramIndex}) OR
        LOWER(classification_descriptions) LIKE LOWER($${paramIndex})
      )`)
      queryParams.push(searchTerm)
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM contractors 
      ${whereClause}
    `

    const { rows: countRows } = await client.query(countQuery, queryParams)
    const total = parseInt(countRows[0].total)

    // Get contractors with pagination
    const contractorsQuery = `
      SELECT 
        id, license_no, business_name, full_business_name,
        mailing_address, city, county, state, zip_code, 
        business_phone, business_type, primary_status,
        primary_classification, classification_descriptions,
        expiration_date
      FROM contractors 
      ${whereClause}
      ORDER BY business_name ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    queryParams.push(limit, offset.toString())

    const { rows: contractors } = await client.query(contractorsQuery, queryParams)

    res.status(200).json({
      contractors,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string))
    })

  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database query failed' })
  } finally {
    await client.end()
  }
}

