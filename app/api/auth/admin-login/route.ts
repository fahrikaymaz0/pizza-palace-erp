import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log('Login attempt:', { username }) // Debug için

    // Basit auth check - gerçekte database'den kontrol edin
    if (username === 'admin' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: { username, role: 'admin' }
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid credentials'
    }, { status: 401 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 })
  }
}

// OPTIONS method for CORS
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