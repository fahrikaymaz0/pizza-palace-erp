import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyCode } from '@/lib/emailService';
import { getDatabase } from '@/lib/sqlite';
import { securityMiddleware } from '../../middleware/security';
import {
  createSuccessResponse,
  createErrorResponse,
  ERROR_CODES,
  InputValidator,
  generateRequestId,
} from '@/lib/apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`✉️ [${requestId}] Email doğrulama API başladı`);

  try {
    // Güvenlik middleware'i uygula
    const securityResult = await securityMiddleware(request);
    if (securityResult) return securityResult;

    // Request body validation
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error(`❌ [${requestId}] JSON parse hatası:`, parseError);
      return createErrorResponse(
        'Geçersiz JSON formatı',
        ERROR_CODES.INVALID_JSON,
        requestId,
        400
      );
    }

    const { email, code } = body;
    console.log(`✅ [${requestId}] Email doğrulama isteği:`, {
      email: email?.substring(0, 3) + '***',
      code: code?.substring(0, 2) + '****',
    });

    // Professional input validation
    const validator = new InputValidator();
    validator.validateEmail(email).validateCode(code);

    const validationResponse = validator.createErrorResponse(requestId);
    if (validationResponse) return validationResponse;

    // Database kod doğrulama
    console.log(`🔍 [${requestId}] Kod doğrulama başlıyor...`);

    let verificationResult;
    try {
      verificationResult = await verifyCode(email, code);
    } catch (verifyError) {
      console.error(`❌ [${requestId}] Kod doğrulama hatası:`, verifyError);
      return createErrorResponse(
        'Kod doğrulama sırasında hata oluştu',
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        requestId,
        500
      );
    }

    if (!verificationResult.valid) {
      console.log(
        `❌ [${requestId}] Kod doğrulanamadı:`,
        verificationResult.message
      );
      return createErrorResponse(
        verificationResult.message,
        ERROR_CODES.INVALID_CODE,
        requestId,
        400
      );
    }

    console.log(`✅ [${requestId}] Kod doğrulandı, kullanıcı kaydediliyor...`);

    // Kullanıcı verilerini al
    const userData = verificationResult.userData;
    if (!userData) {
      console.log(`❌ [${requestId}] Kullanıcı verileri bulunamadı`);
      return createErrorResponse(
        'Kullanıcı verileri bulunamadı. Lütfen tekrar kayıt olun.',
        ERROR_CODES.USER_NOT_FOUND,
        requestId,
        400
      );
    }

    // SQLite Database bağlantısı
    let database;
    try {
      database = getDatabase();
      console.log(`💾 [${requestId}] SQLite Database bağlantısı kuruldu`);
    } catch (dbInitError) {
      console.error(
        `❌ [${requestId}] SQLite Database başlatma hatası:`,
        dbInitError
      );
      return createErrorResponse(
        'Veritabanı bağlantısı kurulamadı',
        ERROR_CODES.DATABASE_CONNECTION_ERROR,
        requestId,
        500
      );
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = database
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email.toLowerCase()) as any;

    let user;
    if (existingUser && existingUser.id) {
      console.log(
        '✅ Kullanıcı zaten mevcut, email verified olarak işaretleniyor'
      );

      user = existingUser;

      // Email doğrulama durumunu güncelle
      database
        .prepare(
          'UPDATE user_profiles SET email_verified = 1 WHERE user_id = ?'
        )
        .run(user.id);

      console.log('✅ Email doğrulama durumu güncellendi:', user.id);
    } else {
      console.log('✅ Yeni kullanıcı kaydediliyor...');

      // Şifreyi hash'le
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Transaction başlat
      database.prepare('BEGIN TRANSACTION').run();

      try {
        // Kullanıcıyı SQLite'a kaydet
        const insertUser = database.prepare(
          'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
        );
        const result = insertUser.run(
          email.toLowerCase(),
          hashedPassword,
          userData.name
        );

        const userId = result.lastInsertRowid;

        // Kullanıcı profilini oluştur
        database
          .prepare(
            `
          INSERT INTO user_profiles (user_id, phone, email, email_verified, total_orders, total_spent) 
          VALUES (?, ?, ?, ?, ?, ?)
        `
          )
          .run(userId, userData.phone || '', email.toLowerCase(), 1, 0, 0);

        // Transaction'ı commit et
        database.prepare('COMMIT').run();

        // Kullanıcıyı getir
        user = database.prepare('SELECT * FROM users WHERE id = ?').get(userId);

        if (!user) {
          throw new Error('Kullanıcı oluşturulamadı');
        }

        console.log(
          '✅ Kullanıcı başarıyla kaydedildi ve email doğrulandı:',
          email
        );
      } catch (error) {
        // Hata durumunda rollback
        database.prepare('ROLLBACK').run();
        throw error;
      }
    }

    // JWT token oluştur
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'user',
        email_verified: true,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log(
      `✅ [${requestId}] Email doğrulandı ve kullanıcı giriş yaptı:`,
      email
    );

    // NextResponse oluştur
    const response = NextResponse.json(
      {
        success: true,
        message: 'Email başarıyla doğrulandı! Hoş geldiniz.',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: 'user',
            email_verified: true,
          },
        },
        requestId,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

    // Secure cookie ayarla
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 gün
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(`❌ [${requestId}] Email doğrulama kritik hatası:`, error);
    return createErrorResponse(
      'Email doğrulama sırasında beklenmeyen hata oluştu',
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      requestId,
      500
    );
  }
}
