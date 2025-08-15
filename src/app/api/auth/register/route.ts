import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 User registration attempt...');
    
    const body = await request.json();
    const { name, email, password } = body;

    console.log('📧 New user:', { name, email });

    // Basit validasyon
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Tüm alanlar gerekli'
      }, { status: 400 });
    }

    console.log('✅ Registration successful:', email);

    // Başarılı kayıt
    return NextResponse.json({
      success: true,
      message: 'Kayıt başarılı',
      data: {
        user: {
          id: 'new-user-' + Date.now(),
          email: email,
          name: name,
          role: 'user'
        },
        token: 'new-user-token-' + Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
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
