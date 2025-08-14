import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/sqlite';
import { verifyCode } from '@/lib/emailService';
import { securityMiddleware } from '../../middleware/security';
import {
  createSuccessResponse,
  createErrorResponse,
  ERROR_CODES,
  InputValidator,
} from '@/lib/apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`🔐 [${requestId}] Reset Password API başladı`);

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
      return NextResponse.json(
        {
          success: false,
          error: 'Geçersiz JSON formatı',
          code: 'INVALID_JSON',
          requestId,
        },
        { status: 400 }
      );
    }

    const { email, code, newPassword } = body;
    console.log(`🔑 [${requestId}] Şifre sıfırlama isteği:`, {
      email: email?.substring(0, 3) + '***',
      code: code?.substring(0, 2) + '****',
    });

    // Input validation
    const validator = new InputValidator();
    validator
      .validateEmail(email)
      .validateCode(code)
      .validateRequired(newPassword, 'Yeni şifre')
      .validateLength(newPassword, 6, 128, 'Yeni şifre');

    const validationResponse = validator.createErrorResponse(requestId);
    if (validationResponse) return validationResponse;

    // SQLite Database bağlantısı
    let database;
    try {
      database = getDatabase();
      console.log(`💾 [${requestId}] SQLite Database bağlantısı kuruldu`);
    } catch (dbInitError) {
      console.error(
        `❌ [${requestId}] SQLite Database bağlantı hatası:`,
        dbInitError
      );
      return createErrorResponse(
        'Veritabanı bağlantısı kurulamadı',
        ERROR_CODES.DATABASE_CONNECTION_ERROR,
        requestId,
        500
      );
    }

    // Database kod doğrulama
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
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        requestId,
        400
      );
    }

    console.log(`✅ [${requestId}] Kod doğrulandı, şifre güncellenıyor...`);

    // Kullanıcıyı getir
    const user = database
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email.toLowerCase()) as any;

    if (!user || !user.id) {
      console.log(`❌ [${requestId}] Kullanıcı bulunamadı:`, email);
      return createErrorResponse(
        'Kullanıcı bulunamadı',
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        requestId,
        404
      );
    }

    // Yeni şifreyi hash'le
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    } catch (hashError) {
      console.error(`❌ [${requestId}] Şifre hash hatası:`, hashError);
      return createErrorResponse(
        'Şifre işlenirken hata oluştu',
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        requestId,
        500
      );
    }

    // Şifreyi güncelle
    try {
      database
        .prepare('UPDATE users SET password_hash = ? WHERE id = ?')
        .run(hashedPassword, user.id);

      console.log(`✅ [${requestId}] Şifre başarıyla güncellendi:`, user.id);
    } catch (updateError) {
      console.error(`❌ [${requestId}] Şifre güncelleme hatası:`, updateError);
      return createErrorResponse(
        'Şifre güncellenirken hata oluştu',
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        requestId,
        500
      );
    }

    // JWT token oluştur
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'user',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Response cookie'si ayarla
    const response = NextResponse.json({
      success: true,
      message: 'Şifreniz başarıyla güncellendi!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 gün
    });

    console.log(`🎉 [${requestId}] Şifre sıfırlama başarılı:`, user.email);
    return response;
  } catch (error) {
    console.error(`❌ [${requestId}] Beklenmeyen hata:`, error);
    return createErrorResponse(
      'Beklenmeyen bir hata oluştu',
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      requestId,
      500
    );
  }
}
