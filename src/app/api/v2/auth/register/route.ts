import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Vercel'de kullanılacak geçici kullanıcılar (gerçek uygulamada Supabase kullanılacak)
const VERCEL_USERS: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Input validation
    if (!email || !password || !name) {
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

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    // Email zaten kullanımda mı kontrol et
    const existingUser = VERCEL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Bu email adresi zaten kullanımda' },
        { status: 409 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = {
      id: (VERCEL_USERS.length + 1).toString(),
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      name: name.trim(),
      role: 'user',
      created_at: new Date().toISOString()
    };

    // Kullanıcıyı listeye ekle (gerçek uygulamada veritabanına kaydedilir)
    VERCEL_USERS.push(newUser);

    // JWT token oluştur
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Kayıt başarılı!',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        },
        token
      }
    }, { status: 201 });

    // Cookie ayarla
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Vercel register error:', error);
    return NextResponse.json(
      { success: false, error: 'Kayıt sırasında hata oluştu' },
      { status: 500 }
    );
  }
} 