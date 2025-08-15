import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/sqlite';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

    // Test kullanıcıları
    const testUsers = [
      {
        email: 'test@example.com',
        password: '123456',
        name: 'Test Kullanıcı',
        role: 'user',
      },
      {
        email: 'admin@123',
        password: '123456',
        name: 'Kaymaz Admin',
        role: 'admin',
      },
      {
        email: 'pizzapalaceofficial00@gmail.com',
        password: '123456',
        name: 'Pizza Palace Admin',
        role: 'pizza_admin',
      },
    ];

    // Test kullanıcısını bul
    const testUser = testUsers.find(
      user =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (!testUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email veya şifre hatalı',
        },
        { status: 401 }
      );
    }

    // JWT token oluştur
    const token = jwt.sign(
      {
        userId: testUser.email, // Email'i ID olarak kullan
        email: testUser.email,
        name: testUser.name,
        role: testUser.role,
        isAdmin: testUser.role === 'admin',
        loginTime: new Date().toISOString(),
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: 'Test girişi başarılı',
        data: {
          user: {
            id: testUser.email,
            email: testUser.email,
            name: testUser.name,
            role: testUser.role,
            isAdmin: testUser.role === 'admin',
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

    return response;
  } catch (error) {
    console.error('Test login hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Giriş sırasında hata oluştu',
      },
      { status: 500 }
    );
  }
}
