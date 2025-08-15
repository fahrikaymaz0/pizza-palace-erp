import { NextRequest, NextResponse } from 'next/server';

// Basit admin kullanıcıları
const ADMIN_USERS = [
  {
    email: 'admin@123',
    password: '123456',
    name: 'Kaymaz Admin',
    role: 'admin'
  },
  {
    email: 'pizzapalaceofficial00@gmail.com',
    password: '123456',
    name: 'Pizza Palace Admin',
    role: 'pizza_admin'
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Admin login attempt - Cache busting version...');
    
    const body = await request.json();
    const { email, password } = body;

    console.log('📧 Email:', email);
    console.log('🔑 Password check...');

    // Kullanıcıyı bul
    const user = ADMIN_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      console.log('❌ Invalid credentials');
      return NextResponse.json({
        success: false,
        error: 'Geçersiz email veya şifre'
      }, { 
        status: 401,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    console.log('✅ Admin login successful:', user.email);

    // Başarılı giriş
    return NextResponse.json({
      success: true,
      message: 'Admin girişi başarılı',
      data: {
        user: {
          id: '1',
          email: user.email,
          name: user.name,
          role: user.role
        },
        token: 'admin-token-' + Date.now()
      }
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('❌ Admin login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'POST metodu kullanın'
  }, { 
    status: 405,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
