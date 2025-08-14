import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/sqlite';
import { verifyCode } from '@/lib/emailService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, code, password, name } = await request.json();

    if (!email || !code || !password || !name) {
      return NextResponse.json(
        { error: 'Tüm alanlar gerekli' },
        { status: 400 }
      );
    }

    console.log(`Kod doğrulama isteği: ${email} -> ${code}`);

    // Kodu doğrula
    const result = await verifyCode(email, code);
    
    if (!result.valid) {
      console.log(`Kod doğrulanamadı: ${email} -> ${result.message}`);
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    console.log(`Kod doğrulandı, kullanıcı kaydediliyor: ${email}`);

    const database = getDatabase();

    // Transaction başlat
    database.prepare('BEGIN TRANSACTION').run();

    try {
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(password, 10);

      // Kullanıcıyı SQLite'a kaydet
      const insertUser = database.prepare(`
        INSERT INTO users (email, password_hash, name, created_at) 
        VALUES (?, ?, ?, ?)
      `);
      
      const userResult = insertUser.run(
        email.toLowerCase(),
        hashedPassword,
        name.trim(),
        new Date().toISOString()
      );
      
      const userId = userResult.lastInsertRowid;

      // Kullanıcı profilini oluştur
      database.prepare(`
        INSERT INTO user_profiles (user_id, email, email_verified, created_at) 
        VALUES (?, ?, ?, ?)
      `).run(
        userId,
        email.toLowerCase(),
        1, // email_verified = true
        new Date().toISOString()
      );

      // Kullanıcıyı getir
      const user = database.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
      
      if (!user || !user.id) {
        throw new Error('Kullanıcı oluşturulamadı');
      }

      // Transaction'ı commit et
      database.prepare('COMMIT').run();

      // JWT token oluştur
      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name, role: 'user' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log(`Kullanıcı başarıyla kaydedildi: ${email}`);

      // NextResponse oluştur
      const response = NextResponse.json({
        success: true,
        message: 'Hesabınız başarıyla oluşturuldu!',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });

      // Secure cookie ayarla
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 gün
        path: '/'
      });

      return response;

    } catch (error) {
      // Hata durumunda rollback
      database.prepare('ROLLBACK').run();
      throw error;
    }

  } catch (error) {
    console.error('Kod doğrulama hatası:', error);
    return NextResponse.json(
      { error: 'Doğrulama sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 