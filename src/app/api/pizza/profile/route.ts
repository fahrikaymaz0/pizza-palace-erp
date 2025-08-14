import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/sqlite';
import { 
  createErrorResponse, 
  ERROR_CODES, 
  generateRequestId 
} from '@/lib/apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface User {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  last_login: string;
  total_orders: number;
  total_spent: number;
}

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`👤 [${requestId}] Profile API GET başladı`);
  
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
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
    const database = getDatabase();
    
    // Kullanıcı bilgilerini SQLite'dan al
    const user = database.prepare('SELECT * FROM users WHERE id = ?').get(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND',
          requestId 
        },
        { status: 404 }
      );
    }

    // Kullanıcının sipariş istatistiklerini SQLite'dan hesapla
    const orders = database.prepare('SELECT * FROM orders WHERE user_id = ?').all(decoded.userId);
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total_amount), 0);

    // Kullanıcı profilini al
    const profile = database.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(decoded.userId);

    const userProfile: User = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      email_verified: profile?.email_verified || false,
      created_at: user.created_at,
      last_login: user.last_login || user.created_at,
      total_orders: totalOrders,
      total_spent: totalSpent
    };

    console.log(`✅ [${requestId}] Profile başarıyla getirildi: ${user.email}`);
    
    return NextResponse.json({
      success: true,
      message: 'Profil bilgileri başarıyla getirildi',
      data: { user: userProfile },
      requestId,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error(`❌ [${requestId}] Profile GET error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Profil bilgileri alınamadı',
        code: 'INTERNAL_SERVER_ERROR',
        requestId 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`👤 [${requestId}] Profile API PUT başladı`);
  
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
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
    const { name, email } = await request.json();
    
    if (!name || !email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ad ve email alanları zorunludur',
          code: 'VALIDATION_ERROR',
          requestId 
        },
        { status: 400 }
      );
    }

    const database = getDatabase();
    
    // Mevcut kullanıcı bilgilerini al
    const currentUser = database.prepare('SELECT * FROM users WHERE id = ?').get(decoded.userId);
    
    if (!currentUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND',
          requestId 
        },
        { status: 404 }
      );
    }
    
    const emailChanged = currentUser.email !== email;
    
    // Kullanıcı bilgilerini güncelle
    database.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(name, email, decoded.userId);
    
    // Email değişikliği varsa doğrulama durumunu sıfırla
    if (emailChanged) {
      database.prepare('UPDATE user_profiles SET email_verified = 0 WHERE user_id = ?').run(decoded.userId);
    }

    // Güncellenmiş kullanıcı bilgilerini al
    const updatedUser = database.prepare('SELECT * FROM users WHERE id = ?').get(decoded.userId);
    const updatedProfile = database.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(decoded.userId);

    // Sipariş istatistiklerini SQLite'dan hesapla
    const orders = database.prepare('SELECT * FROM orders WHERE user_id = ?').all(decoded.userId);
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total_amount), 0);

    const userProfile: User = {
      id: updatedUser.id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      email_verified: updatedProfile?.email_verified || false,
      created_at: updatedUser.created_at,
      last_login: updatedUser.last_login || updatedUser.created_at,
      total_orders: totalOrders,
      total_spent: totalSpent
    };

    console.log(`✅ [${requestId}] Profile başarıyla güncellendi: ${updatedUser.email}`);
    
    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      data: { user: userProfile },
      requestId,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error(`❌ [${requestId}] Profile PUT error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Profil güncellenemedi',
        code: 'INTERNAL_SERVER_ERROR',
        requestId 
      },
      { status: 500 }
    );
  }
} 