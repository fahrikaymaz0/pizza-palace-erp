import { NextRequest, NextResponse } from 'next/server';

// Basit kullanıcılar
const USERS = [
  {
    email: 'test@example.com',
    password: '123456',
    name: 'Test Kullanıcı',
    role: 'user'
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 User login attempt...');
    
    const body = await request.json();
    const { email, password } = body;

    console.log('📧 Email:', email);

    // Kullanıcıyı bul
    const user = USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      console.log('❌ Invalid credentials');
      return NextResponse.json({
        success: false,
        error: 'Geçersiz email veya şifre'
      }, { status: 401 });
    }

    console.log('✅ User login successful:', user.email);

    // Başarılı giriş
    return NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: {
          id: '1',
          email: user.email,
          name: user.name,
          role: user.role
        },
        token: 'user-token-' + Date.now()
      }
    });

  } catch (error) {
    console.error('❌ User login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'POST metodu kullanın'
  }, { status: 405 });
}
