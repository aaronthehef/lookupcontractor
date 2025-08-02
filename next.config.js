/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  async rewrites() {
    return [
      // Sitemap rewrites to serve from root domain
      {
        source: '/sitemap-index.xml',
        destination: '/api/sitemap-index.xml'
      },
      {
        source: '/sitemap-pages.xml',
        destination: '/api/sitemap-pages.xml'
      },
      {
        source: '/sitemap-contractors-:page.xml',
        destination: '/api/sitemap-contractors-:page.xml'
      }
    ]
  }
}

module.exports = nextConfig