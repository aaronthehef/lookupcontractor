import cache from '../../lib/cache.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const stats = cache.getStats()
    
    res.status(200).json({
      cacheSize: stats.size,
      cachedItems: stats.keys,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    })
  } catch (error) {
    console.error('Cache stats error:', error)
    res.status(500).json({ error: 'Failed to get cache statistics' })
  }
}

