import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pizza-palace-cache-breaking-2024';

// Cache-breaking admin authentication system
const ADMIN_USERS = [
  {
    id: '2',
    email: 'admin@123',
    password: '123456',
    name: 'Admin',
    role: 'admin'
  },
  {
    id: '3',
    email: 'pizzapalaceofficial00@gmail.com',
    password: '123456',
    name: 'Pizza Admin',
    role: 'pizza_admin'
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 CACHE-BREAKING ADMIN LOGIN - Eski endpoint düzeltildi');
    
    const body = await request.json();
    const { email, password } = body;

    console.log('📥 Admin login request:', { email: email?.substring(0, 3) + '***' });

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }

    const admin = ADMIN_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );

    if (!admin) {
      console.log('❌ Invalid admin credentials');
      return NextResponse.json(
        { success: false, error: 'Geçersiz email veya şifre' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Admin girişi başarılı',
      data: {
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
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

    console.log('✅ Admin login successful:', admin.email);
    return response;

  } catch (error) {
    console.error('❌ Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Admin giriş hatası' },
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
