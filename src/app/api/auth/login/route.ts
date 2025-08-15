import { NextRequest, NextResponse } from 'next/server';
import { SimpleAuthService } from '@/lib/simple-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }

    const result = await SimpleAuthService.login(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: result.user,
        token: result.token
      }
    });

    // Cookie ayarla
    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 saat
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// GET method for 405 error fix
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'GET metodu desteklenmiyor. POST kullanın.' },
    { status: 405 }
  );
}
