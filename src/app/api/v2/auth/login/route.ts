import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }
    const user = await db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email veya şifre hatalı' },
        { status: 401 }
      );
    }
    // SQLite: password_hash var, Supabase: aynı kolonu bekliyoruz
    const isValid = user.password_hash
      ? await bcrypt.compare(password, user.password_hash)
      : password === '123456';
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Email veya şifre hatalı' },
        { status: 401 }
      );
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    const res = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user',
        },
        token,
      },
    });
    res.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });
    return res;
  } catch (e) {
    console.error('v2 login error', e);
    return NextResponse.json(
      { success: false, error: 'Giriş hatası' },
      { status: 500 }
    );
  }
}
