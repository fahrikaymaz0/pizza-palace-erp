import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/sqlite';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Authorization header'dan token al
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token bulunamadı',
          data: { user: null },
        },
        { status: 401 }
      );
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Geçersiz token',
          data: { user: null },
        },
        { status: 401 }
      );
    }

    // Test kullanıcıları için özel kontrol
    const testUsers = [
      {
        id: 'test@example.com',
        email: 'test@example.com',
        name: 'Test Kullanıcı',
        role: 'user'
      },
      {
        id: 'admin@123',
        email: 'admin@123',
        name: 'Kaymaz Admin',
        role: 'admin'
      },
      {
        id: 'pizzapalaceofficial00@gmail.com',
        email: 'pizzapalaceofficial00@gmail.com',
        name: 'Pizza Palace Admin',
        role: 'pizza_admin'
      }
    ];

    // Önce test kullanıcılarında ara
    let user = testUsers.find(u => u.id === decoded.userId);
    
    if (!user) {
      // Test kullanıcısı değilse veritabanından ara
      const database = getDatabase();
      user = database
        .prepare('SELECT id, email, name, role FROM users WHERE id = ?')
        .get(decoded.userId) as any;
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Kullanıcı bulunamadı',
          data: { user: null },
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Token geçerli',
        data: { 
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || 'user',
            isAdmin: decoded.isAdmin || false
          }
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Token doğrulanamadı',
        data: { user: null },
      },
      { status: 401 }
    );
  }
}
