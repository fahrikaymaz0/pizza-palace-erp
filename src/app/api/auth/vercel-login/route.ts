import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Vercel'de çalışacak test kullanıcıları (veritabanı olmadan)
const VERCEL_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    password: '123456',
    name: 'Test Kullanıcı',
    role: 'user',
  },
  {
    id: '2',
    email: 'admin@123',
    password: '123456',
    name: 'Kaymaz Admin',
    role: 'admin',
  },
  {
    id: '3',
    email: 'pizzapalaceofficial00@gmail.com',
    password: '123456',
    name: 'Pizza Palace Admin',
    role: 'pizza_admin',
  },
];

// GET metodu - Vercel'deki 405 hatasını çözmek için
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'GET metodu desteklenmiyor. POST kullanın.',
      code: 'METHOD_NOT_ALLOWED',
    },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 Vercel Login isteği:', {
      email: email?.substring(0, 3) + '***',
    });

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email ve şifre gereklidir',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const user = VERCEL_USERS.find(
      u =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      console.log('❌ Kullanıcı bulunamadı:', email);
      return NextResponse.json(
        {
          success: false,
          error: 'Email veya şifre hatalı',
          code: 'INVALID_CREDENTIALS',
        },
        { status: 401 }
      );
    }

    console.log('✅ Kullanıcı doğrulandı:', user.email);

    // JWT token oluştur
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.role === 'admin',
        loginTime: new Date().toISOString(),
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: 'Vercel girişi başarılı',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isAdmin: user.role === 'admin',
          },
          token: token,
        },
      },
      { status: 200 }
    );

    // Cookie ayarla
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 saat
      path: '/',
    });

    console.log('✅ Vercel login tamamlandı:', user.email);
    return response;
  } catch (error) {
    console.error('❌ Vercel login hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Giriş sırasında hata oluştu',
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}
