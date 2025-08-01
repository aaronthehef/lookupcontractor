const monitor = require('../../lib/performance.js')

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const summary = monitor.getSummary()
    
    // Add system metrics
    const systemMetrics = {
      uptime: Math.round(process.uptime()),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString()
    }

    res.status(200).json({
      ...summary,
      system: systemMetrics
    })
  } catch (error) {
    console.error('Performance dashboard error:', error)
    res.status(500).json({ error: 'Failed to get performance metrics' })
  }
}

module.exports = handler

