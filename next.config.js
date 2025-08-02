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
        source: '/sitemap-contractors-:page(\\d+).xml',
        destination: '/api/sitemap-contractors-:page'
      }
    ]
  }
}

module.exports = nextConfig