import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Vercel'de çalışacak test kullanıcıları (veritabanı olmadan)
const VERCEL_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test Kullanıcı',
    role: 'user'
  },
  {
    id: '2',
    email: 'admin@123',
    name: 'Kaymaz Admin',
    role: 'admin'
  },
  {
    id: '3',
    email: 'pizzapalaceofficial00@gmail.com',
    name: 'Pizza Palace Admin',
    role: 'pizza_admin'
  }
];

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

    // Kullanıcı bilgilerini Vercel users'dan al
    const user = VERCEL_USERS.find(u => u.id === decoded.userId);

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
            role: user.role,
            isAdmin: user.role === 'admin'
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