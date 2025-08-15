import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pizza-palace-cache-breaking-2024';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 CACHE-BREAKING VERIFY - Eski endpoint düzeltildi');
    
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      console.log('❌ No token found');
      return NextResponse.json(
        { success: false, error: 'Token bulunamadı' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      console.log('✅ Token verified for user:', decoded.email);
      
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: decoded.userId,
            email: decoded.email,
            name: decoded.name || 'User',
            role: decoded.role
          }
        }
      });
    } catch (jwtError) {
      console.log('❌ Invalid token');
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('❌ Verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Doğrulama hatası' },
      { status: 500 }
    );
  }
}
