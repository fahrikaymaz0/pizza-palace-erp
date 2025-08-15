import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/sqlite';
import { generateRequestId } from '@/lib/apiResponse';

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
  const requestId = generateRequestId();
  console.log(`🔐 [${requestId}] Admin Login API başladı`);

  try {
    const body = await request.json();
    const { email, password } = body;

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

    const database = getDatabase();

    // Admin kullanıcıyı doğrula (email ve role=admin)
    const admin = database
      .prepare('SELECT * FROM users WHERE email = ? AND role = ?')
      .get(email, 'admin') as any;

    if (!admin) {
      console.log(`❌ [${requestId}] Admin bulunamadı: ${email}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Geçersiz email veya şifre',
          code: 'INVALID_CREDENTIALS',
          requestId,
        },
        { status: 401 }
      );
    }

    // Basit şifre kontrolü: password_hash alanını düz metin olarak kullanıyoruz (demo)
    if (password !== admin.password_hash) {
      console.log(`❌ [${requestId}] Yanlış şifre: ${email}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Geçersiz email veya şifre',
          code: 'INVALID_CREDENTIALS',
          requestId,
        },
        { status: 401 }
      );
    }

    // Admin token
    const adminToken = jwt.sign(
      { userId: admin.id, email: admin.email, role: 'admin', name: admin.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    database
      .prepare('UPDATE users SET last_login = ? WHERE id = ?')
      .run(new Date().toISOString(), admin.id);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Admin girişi başarılı',
        data: {
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: 'admin',
          },
        },
        requestId,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

    response.cookies.set('admin-token', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(`❌ [${requestId}] Admin Login error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Admin girişi yapılamadı',
        code: 'INTERNAL_SERVER_ERROR',
        requestId,
      },
      { status: 500 }
    );
  }
}
