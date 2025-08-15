import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pizza-palace-unified-secret-2024';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 UNIFIED REGISTER - Cache Breaking Version');
    
    const body = await request.json();
    const { name, email, password } = body;

    console.log('📥 Register request:', { email: email?.substring(0, 3) + '***' });

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

    // For Vercel compatibility, simulate registration success
    const newUser = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name: name.trim(),
      role: 'user'
    };

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Kayıt başarılı!',
      data: {
        user: newUser,
        token
      }
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    });

    console.log('✅ Registration successful:', newUser.email);
    return response;

  } catch (error) {
    console.error('❌ Unified register error:', error);
    return NextResponse.json(
      { success: false, error: 'Kayıt hatası' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'POST metodu kullanın' },
    { status: 405 }
  );
} 