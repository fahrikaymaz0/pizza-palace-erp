import { NextRequest, NextResponse } from 'next/server'

// Basit in-memory user storage
const users = [
  { id: 1, email: 'admin@123', password: '123456', name: 'Admin', role: 'ADMIN' },
  { id: 2, email: 'test@example.com', password: '123456', name: 'Test User', role: 'USER' }
]

// Hem GET hem POST destekleyen handler
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Login API GET method çalışıyor!',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400 }
      )
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { error: 'Geçersiz email veya şifre' },
        { status: 401 }
      )
    }

    // Generate token
    const token = `token-${user.id}-${Date.now()}`

    // Return response
    return NextResponse.json({
      success: true,
      message: 'Giriş başarılı!',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Giriş sırasında hata oluştu' },
      { status: 500 }
    )
  }
} 