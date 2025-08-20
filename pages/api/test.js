export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      version: 'Next.js Pages Router'
    })
  }

  if (req.method === 'POST') {
    try {
      const body = req.body
      return res.status(200).json({
        message: 'POST is working!',
        received: body,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return res.status(500).json({
        message: 'POST error',
        error: String(error)
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
} 