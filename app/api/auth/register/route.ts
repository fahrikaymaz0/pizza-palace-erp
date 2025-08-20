import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, confirmPassword } = body

    console.log('Register attempt:', { username, email }) // Debug

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required'
      }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: 'Passwords do not match'
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Password must be at least 6 characters'
      }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 })
    }

    // Check if user already exists (simulated)
    // Gerçek projede database kontrol edersiniz
    if (username === 'admin' || email === 'admin@test.com') {
      return NextResponse.json({
        success: false,
        message: 'User already exists'
      }, { status: 409 })
    }

    // Simulate user creation
    // Gerçek projede database'e kayıt edersiniz
    const newUser = {
      id: Date.now(),
      username,
      email,
      createdAt: new Date().toISOString()
    }

    console.log('New user created:', newUser) // Debug

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        username: newUser.username,
        email: newUser.email
      }
    })

  } catch (error) {
    console.error('Register API Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error during registration'
    }, { status: 500 })
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 