import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/sqlite';
import { 
  createErrorResponse, 
  ERROR_CODES, 
  generateRequestId 
} from '@/lib/apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`🔐 [${requestId}] Auth verify API başladı`);
  
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      console.log(`❌ [${requestId}] Token bulunamadı`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token bulunamadı',
          code: 'TOKEN_INVALID',
          requestId 
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.userId) {
      console.log(`❌ [${requestId}] Geçersiz token decode`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz token',
          code: 'TOKEN_INVALID',
          requestId 
        },
        { status: 401 }
      );
    }

    console.log(`✅ [${requestId}] Token decode başarılı, user: ${decoded.userId}`);

    // SQLite'dan kullanıcı bilgilerini al
    const database = getDatabase();
    
    const user = database.prepare('SELECT * FROM users WHERE id = ?').get(decoded.userId);
    
    if (!user) {
      console.log(`❌ [${requestId}] SQLite Database'de kullanıcı bulunamadı: ${decoded.userId}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND',
          requestId 
        },
        { status: 401 }
      );
    }

    // Kullanıcı profilini SQLite'dan al
    const profile = database.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(decoded.userId);

    console.log(`✅ [${requestId}] Auth verify başarılı: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Token doğrulandı',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: profile?.phone || '',
          email_verified: profile?.email_verified || false,
          phone_verified: profile?.phone_verified || false
        }
      },
      requestId,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error(`❌ [${requestId}] Token verification error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Token doğrulanamadı',
        code: 'TOKEN_INVALID',
        requestId 
      },
      { status: 401 }
    );
  }
} 