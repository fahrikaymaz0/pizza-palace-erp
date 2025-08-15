import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pizza-palace-cache-breaking-2024';

// Cache-breaking authentication system
const USERS = [
  {
    id: '1',
    email: 'test@example.com',
    password: '123456',
    name: 'Test Kullanıcı',
    role: 'user'
  },
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
    console.log('🔄 CACHE-BREAKING LOGIN - Eski endpoint düzeltildi');
    
    const body = await request.json();
    const { email, password } = body;

    console.log('📥 Login request:', { email: email?.substring(0, 3) + '***' });

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }

    const user = USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );

    if (!user) {
      console.log('❌ Invalid credentials');
      return NextResponse.json(
        { success: false, error: 'Email veya şifre hatalı' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
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

    console.log('✅ Login successful:', user.email);
    return response;

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Giriş hatası' },
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
