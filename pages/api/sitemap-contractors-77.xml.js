export default function handler(req, res) { res.status(410).json({ error: 'This sitemap has been permanently moved', newLocation: 'https://www.lookupcontractor.com/sitemap-index.xml' }) }
