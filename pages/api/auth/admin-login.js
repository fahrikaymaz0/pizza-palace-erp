export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body

    console.log('Login attempt:', { username })

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      })
    }

    // Simple auth check
    if (username === 'admin' && password === 'admin123') {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: { username, role: 'admin' }
      })
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })

  } catch (error) {
    console.error('Login API Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
} 