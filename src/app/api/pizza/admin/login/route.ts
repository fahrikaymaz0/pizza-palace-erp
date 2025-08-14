import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/sqlite';
import {
  createSuccessResponse,
  createErrorResponse,
  ERROR_CODES,
  generateRequestId
} from '@/lib/apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`🍕 [${requestId}] Pizza Admin Login API başladı`);
  
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return createErrorResponse(
        'Email ve şifre gereklidir',
        ERROR_CODES.VALIDATION_ERROR,
        requestId,
        400
      );
    }

    const database = getDatabase();
    
    // Pizza admin kullanıcısını kontrol et
    const admin = database.prepare('SELECT * FROM users WHERE email = ? AND role = ?').get(email, 'pizza_admin') as any;
    
    if (!admin) {
      console.log(`❌ [${requestId}] Pizza admin bulunamadı: ${email}`);
      return createErrorResponse(
        'Geçersiz email veya şifre',
        ERROR_CODES.INVALID_CREDENTIALS,
        requestId,
        401
      );
    }
    
    // Şifre kontrolü
    if (password !== admin.password_hash) {
      console.log(`❌ [${requestId}] Yanlış şifre: ${email}`);
      return createErrorResponse(
        'Geçersiz email veya şifre',
        ERROR_CODES.INVALID_CREDENTIALS,
        requestId,
        401
      );
    }

    // Pizza admin token oluştur
    const token = jwt.sign(
      { 
        userId: admin.id, 
        email: admin.email, 
        role: 'pizza_admin',
        timestamp: Date.now()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Son giriş zamanını güncelle
    database.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(admin.id);

    console.log(`✅ [${requestId}] Pizza admin girişi başarılı: ${email}`);
    
    const response = NextResponse.json({
      success: true,
      message: 'Pizza admin girişi başarılı',
      data: {
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      },
      requestId,
      timestamp: new Date().toISOString()
    }, { status: 200 });

    // Pizza admin token cookie'si ayarla
    response.cookies.set('pizza_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 saat
      path: '/'
    });

    return response;

  } catch (error) {
    console.error(`❌ [${requestId}] Pizza admin login error:`, error);
    return createErrorResponse(
      'Giriş işlemi başarısız',
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      requestId,
      500
    );
  }
}





