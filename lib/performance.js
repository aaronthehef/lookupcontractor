// Performance monitoring and analytics utilities

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      apiCalls: new Map(),
      errors: [],
      slowQueries: [],
      cacheHits: 0,
      cacheMisses: 0
    }
    
    // Clean up old metrics every hour
    setInterval(() => this.cleanup(), 3600000)
  }

  // Track API call performance
  trackApiCall(endpoint, duration, success = true, error = null) {
    const key = `${endpoint}_${new Date().getHours()}`
    
    if (!this.metrics.apiCalls.has(key)) {
      this.metrics.apiCalls.set(key, {
        endpoint,
        hour: new Date().getHours(),
        count: 0,
        totalDuration: 0,
        errors: 0,
        slowCalls: 0
      })
    }
    
    const metric = this.metrics.apiCalls.get(key)
    metric.count++
    metric.totalDuration += duration
    
    if (!success) {
      metric.errors++
      this.trackError(endpoint, error)
    }
    
    if (duration > 1000) { // Slow call > 1 second
      metric.slowCalls++
      this.trackSlowQuery(endpoint, duration)
    }
  }

  // Track errors
  trackError(endpoint, error) {
    this.metrics.errors.push({
      endpoint,
      error: error?.message || 'Unknown error',
      timestamp: new Date().toISOString(),
      stack: error?.stack
    })
    
    // Keep only last 100 errors
    if (this.metrics.errors.length > 100) {
      this.metrics.errors = this.metrics.errors.slice(-100)
    }
  }

  // Track slow queries
  trackSlowQuery(endpoint, duration) {
    this.metrics.slowQueries.push({
      endpoint,
      duration,
      timestamp: new Date().toISOString()
    })
    
    // Keep only last 50 slow queries
    if (this.metrics.slowQueries.length > 50) {
      this.metrics.slowQueries = this.metrics.slowQueries.slice(-50)
    }
  }

  // Track cache performance
  trackCacheHit() {
    this.metrics.cacheHits++
  }

  trackCacheMiss() {
    this.metrics.cacheMisses++
  }

  // Get performance summary
  getSummary() {
    const currentHour = new Date().getHours()
    const recentMetrics = Array.from(this.metrics.apiCalls.values())
      .filter(metric => Math.abs(metric.hour - currentHour) <= 1)
    
    const totalCalls = recentMetrics.reduce((sum, m) => sum + m.count, 0)
    const totalDuration = recentMetrics.reduce((sum, m) => sum + m.totalDuration, 0)
    const totalErrors = recentMetrics.reduce((sum, m) => sum + m.errors, 0)
    const totalSlowCalls = recentMetrics.reduce((sum, m) => sum + m.slowCalls, 0)
    
    const cacheTotal = this.metrics.cacheHits + this.metrics.cacheMisses
    const cacheHitRate = cacheTotal > 0 ? (this.metrics.cacheHits / cacheTotal * 100).toFixed(2) : 0

    return {
      lastHour: {
        totalCalls,
        averageResponseTime: totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0,
        errorRate: totalCalls > 0 ? (totalErrors / totalCalls * 100).toFixed(2) : 0,
        slowCallRate: totalCalls > 0 ? (totalSlowCalls / totalCalls * 100).toFixed(2) : 0
      },
      cache: {
        hitRate: `${cacheHitRate}%`,
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses
      },
      recentErrors: this.metrics.errors.slice(-10),
      slowQueries: this.metrics.slowQueries.slice(-10),
      endpoints: recentMetrics
    }
  }

  // Clean up old metrics
  cleanup() {
    const currentHour = new Date().getHours()
    
    // Remove metrics older than 24 hours
    for (const [key, metric] of this.metrics.apiCalls.entries()) {
      const hourDiff = Math.abs(metric.hour - currentHour)
      if (hourDiff > 12 && hourDiff < 12) { // Handle day boundary
        this.metrics.apiCalls.delete(key)
      }
    }
    
    console.log('Performance metrics cleaned up')
  }

  // Middleware function for Next.js API routes
  middleware() {
    return (req, res, next) => {
      const start = Date.now()
      const endpoint = req.url
      
      // Override res.json to capture response
      const originalJson = res.json
      res.json = function(data) {
        const duration = Date.now() - start
        const success = res.statusCode < 400
        
        monitor.trackApiCall(endpoint, duration, success)
        
        return originalJson.call(this, data)
      }
      
      // Override res.status to capture errors
      const originalStatus = res.status
      res.status = function(code) {
        if (code >= 400) {
          const duration = Date.now() - start
          monitor.trackApiCall(endpoint, duration, false, new Error(`HTTP ${code}`))
        }
        return originalStatus.call(this, code)
      }
      
      if (next) next()
    }
  }
}

// Export singleton instance
const monitor = new PerformanceMonitor()
export default monitor