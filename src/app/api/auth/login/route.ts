import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/sqlite';
import {
  createErrorResponse,
  ERROR_CODES,
  generateRequestId,
} from '@/lib/apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`🔐 [${requestId}] Login API başladı`);

  try {
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

    const { email, password } = body;
    console.log(`🔑 [${requestId}] Login isteği:`, {
      email: email?.substring(0, 3) + '***',
    });

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email ve şifre gereklidir',
          code: 'VALIDATION_ERROR',
          requestId,
        },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        {
          success: false,
          error: 'Veritabanı bağlantısı kurulamadı',
          code: 'DATABASE_CONNECTION_ERROR',
          requestId,
        },
        { status: 500 }
      );
    }

    // Admin kontrolü
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kaymaz.digital';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (
      email.toLowerCase() === adminEmail.toLowerCase() &&
      password === adminPassword
    ) {
      console.log(`👑 [${requestId}] Admin girişi:`, email);

      const adminToken = jwt.sign(
        {
          userId: 'kaymaz_admin',
          email: adminEmail,
          name: 'Kaymaz Admin',
          isAdmin: true,
          loginTime: new Date().toISOString(),
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = NextResponse.json(
        {
          success: true,
          message: 'Admin girişi başarılı',
          data: {
            user: {
              id: 'kaymaz_admin',
              email: adminEmail,
              name: 'Kaymaz Admin',
              isAdmin: true,
            },
            token: adminToken,
          },
          requestId,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );

      // Set secure cookie
      response.cookies.set('admin-token', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
      });

      console.log(`✅ [${requestId}] Admin login tamamlandı`);
      return response;
    }

    // Regular user login
    try {
      // Check if user exists
      const user = database
        .prepare('SELECT * FROM users WHERE email = ?')
        .get(email.toLowerCase()) as any;

      if (!user) {
        console.log(`❌ [${requestId}] Kullanıcı bulunamadı:`, email);
        return NextResponse.json(
          {
            success: false,
            error: 'Email veya şifre hatalı',
            code: 'INVALID_CREDENTIALS',
            requestId,
          },
          { status: 401 }
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        console.log(`❌ [${requestId}] Şifre hatası:`, email);
        return NextResponse.json(
          {
            success: false,
            error: 'Email veya şifre hatalı',
            code: 'INVALID_CREDENTIALS',
            requestId,
          },
          { status: 401 }
        );
      }

      // Check if email is verified
      const profile = database
        .prepare('SELECT email_verified FROM user_profiles WHERE user_id = ?')
        .get(user.id) as any;

      if (profile && !profile.email_verified) {
        console.log(`❌ [${requestId}] Email doğrulanmamış:`, email);
        return NextResponse.json(
          {
            success: false,
            error: 'Email adresinizi doğrulamanız gerekiyor',
            code: 'EMAIL_NOT_VERIFIED',
            requestId,
          },
          { status: 403 }
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user',
          isAdmin: false,
          loginTime: new Date().toISOString(),
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Update last login
      database
        .prepare('UPDATE users SET last_login = ? WHERE id = ?')
        .run(new Date().toISOString(), user.id);

      const response = NextResponse.json(
        {
          success: true,
          message: 'Giriş başarılı',
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role || 'user',
              isAdmin: false,
            },
            token: token,
          },
          requestId,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );

      // Set secure cookie based on user role
      if (user.role === 'pizza_admin') {
        response.cookies.set('pizza_admin_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60, // 24 hours
          path: '/',
        });
      } else {
        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60, // 24 hours
          path: '/',
        });
      }

      console.log(`✅ [${requestId}] Kullanıcı girişi tamamlandı:`, user.email);
      return response;
    } catch (dbError) {
      console.error(`❌ [${requestId}] Database işlem hatası:`, dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Giriş sırasında hata oluştu',
          code: 'INTERNAL_SERVER_ERROR',
          requestId,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`❌ [${requestId}] Login API kritik hatası:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Beklenmeyen bir hata oluştu',
        code: 'INTERNAL_SERVER_ERROR',
        requestId,
      },
      { status: 500 }
    );
  }
}
