import { NextApiRequest, NextApiResponse } from 'next'
import { executeQuery } from '../../lib/database'

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

  try {
    // Build WHERE clause conditions
    let whereConditions = []

    // State filter (required)
    if (state) {
      whereConditions.push(`state = '${state}'`)
    }

    // City filter
    if (city) {
      const cityString = Array.isArray(city) ? city[0] : city
      whereConditions.push(`LOWER(city) = LOWER('${cityString.replace(/'/g, "''")}')`)
    }

    // Contractor type filter - only match primary classification
    if (type) {
      const typeString = Array.isArray(type) ? type[0] : type
      whereConditions.push(`primary_classification = '${typeString.replace(/'/g, "''")}'`)
    }

    // Search term filter
    if (term) {
      const termString = Array.isArray(term) ? term[0] : term
      const searchTerm = termString.replace(/'/g, "''")
      whereConditions.push(`(
        LOWER(business_name) LIKE LOWER('%${searchTerm}%') OR 
        LOWER(full_business_name) LIKE LOWER('%${searchTerm}%') OR 
        license_no LIKE UPPER('%${searchTerm}%') OR
        LOWER(classification_descriptions) LIKE LOWER('%${searchTerm}%')
      )`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM contractors 
      ${whereClause}
    `

    const { rows: countRows } = await executeQuery(countQuery)
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
      LIMIT ${parseInt(limit as string)} OFFSET ${offset}
    `

    const { rows: contractors } = await executeQuery(contractorsQuery)

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
  }
}

