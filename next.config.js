/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  async rewrites() {
    return [
      // Sitemap rewrites to serve from root domain
      {
        source: '/sitemap-index.xml',
        destination: '/api/sitemap-index'
      },
      {
        source: '/sitemap-pages.xml',
        destination: '/api/sitemap-pages'
      },
      {
        source: '/sitemap-contractors-1.xml',
        destination: '/api/sitemap-contractors-1'
      },
      {
        source: '/sitemap-contractors-2.xml',
        destination: '/api/sitemap-contractors-2'
      }
    ]
  }
}

module.exports = nextConfig