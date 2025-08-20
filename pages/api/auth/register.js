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
    const { username, email, password, confirmPassword } = req.body

    console.log('Register attempt:', { username, email })

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      })
    }

    // Check if user already exists (simulated)
    if (username === 'admin' || email === 'admin@test.com') {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      })
    }

    // Simulate user creation
    const newUser = {
      id: Date.now(),
      username,
      email,
      createdAt: new Date().toISOString()
    }

    console.log('New user created:', newUser)

    return res.status(200).json({
      success: true,
      message: 'Registration successful',
      user: {
        username: newUser.username,
        email: newUser.email
      }
    })

  } catch (error) {
    console.error('Register API Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
} 