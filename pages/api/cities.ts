import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // For now, return mock data to get the page working
    const mockCities = [
      { city: 'Los Angeles', county: 'Los Angeles', count: 45231 },
      { city: 'San Diego', county: 'San Diego', count: 23456 },
      { city: 'San Francisco', county: 'San Francisco', count: 18765 },
      { city: 'Sacramento', county: 'Sacramento', count: 12543 },
      { city: 'San Jose', county: 'Santa Clara', count: 15432 },
      { city: 'Fresno', county: 'Fresno', count: 8765 },
      { city: 'Long Beach', county: 'Los Angeles', count: 9876 },
      { city: 'Oakland', county: 'Alameda', count: 7654 },
      { city: 'Bakersfield', county: 'Kern', count: 6543 },
      { city: 'Anaheim', county: 'Orange', count: 8901 },
      { city: 'Santa Ana', county: 'Orange', count: 7890 },
      { city: 'Riverside', county: 'Riverside', count: 6789 }
    ]

    res.status(200).json({
      cities: mockCities
    })

  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: 'API failed' })
  }
}