// Simple in-memory cache for frequently accessed data
class SimpleCache {
  constructor() {
    this.cache = new Map()
    this.ttl = new Map() // Time to live for each cache entry
  }

  set(key, value, ttlMs = 300000) { // Default 5 minutes TTL
    this.cache.set(key, value)
    this.ttl.set(key, Date.now() + ttlMs)
  }

  get(key) {
    // Check if key exists and hasn't expired
    if (this.cache.has(key)) {
      const expiry = this.ttl.get(key)
      if (expiry && Date.now() < expiry) {
        return this.cache.get(key)
      } else {
        // Expired, remove from cache
        this.cache.delete(key)
        this.ttl.delete(key)
      }
    }
    return null
  }

  has(key) {
    const value = this.get(key)
    return value !== null
  }

  delete(key) {
    this.cache.delete(key)
    this.ttl.delete(key)
  }

  clear() {
    this.cache.clear()
    this.ttl.clear()
  }

  size() {
    // Clean expired entries first
    const now = Date.now()
    for (const [key, expiry] of this.ttl.entries()) {
      if (now >= expiry) {
        this.cache.delete(key)
        this.ttl.delete(key)
      }
    }
    return this.cache.size
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.size(),
      keys: Array.from(this.cache.keys())
    }
  }
}

// Export singleton instance
const cache = new SimpleCache()
module.exports = cache