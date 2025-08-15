import { NextRequest, NextResponse } from 'next/server';
import { SimpleAuthService } from '@/lib/simple-auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Tüm alanlar gerekli' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      );
    }

    const result = await SimpleAuthService.register(name, email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Kayıt başarılı!',
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
    console.error('Register API error:', error);
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
