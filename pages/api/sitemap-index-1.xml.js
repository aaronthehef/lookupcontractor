export default function handler(req, res) {
  // Return 410 Gone to tell Google this sitemap no longer exists
  res.status(410).json({ 
    error: 'This sitemap has been permanently moved',
    newLocation: 'https://www.lookupcontractor.com/sitemap-index.xml'
  })
}