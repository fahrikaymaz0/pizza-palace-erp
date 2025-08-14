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

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`🎯 [${requestId}] Campaigns API başladı`);
  
  try {
    const token = request.cookies.get('auth-token')?.value;
    let userOrderCount = 0;

    // Kullanıcı giriş yapmışsa sipariş sayısını kontrol et
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const database = getDatabase();
        
        const orderCountResult = database.prepare('SELECT COUNT(*) as order_count FROM orders WHERE user_id = ?');
        
        userOrderCount = orderCountResult.order_count;
      } catch (error) {
        console.log(`⚠️ [${requestId}] Kullanıcı sipariş sayısı alınamadı:`, error);
      }
    }

    // Kampanyaları tanımla
    const campaigns = [
      {
        id: 1,
        title: 'İlk Sipariş İndirimi',
        description: 'İlk siparişinizde %20 indirim!',
        discount: 20,
        code: 'ILKSIPARIS',
        validFor: userOrderCount === 0 ? 'active' : 'expired',
        condition: 'Sadece ilk sipariş için geçerli'
      },
      {
        id: 2,
        title: '3 Al 2 Öde',
        description: '3 pizza al, 2 tanesini öde!',
        discount: 33,
        code: '3AL2ODE',
        validFor: 'active',
        condition: 'Aynı siparişte 3 pizza'
      },
      {
        id: 3,
        title: 'Hafta Sonu Özel',
        description: 'Hafta sonu siparişlerinde %15 indirim',
        discount: 15,
        code: 'HAFTASONU',
        validFor: 'active',
        condition: 'Cumartesi ve Pazar günleri'
      }
    ];

    console.log(`✅ [${requestId}] Kampanyalar getirildi (Kullanıcı sipariş sayısı: ${userOrderCount})`);
    
    return createSuccessResponse(
      'Kampanyalar başarıyla getirildi',
      { campaigns },
      requestId,
      200
    );

  } catch (error) {
    console.error(`❌ [${requestId}] Campaigns API error:`, error);
    return createErrorResponse(
      'Kampanyalar alınamadı',
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      requestId,
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;
    const { campaignType } = await request.json();

    // Veritabanından kullanıcı siparişlerini al
    const db = PizzaDatabase.getInstance();
    await db.init();
    
    const userOrders = await db.getUserOrders(userId);
    const orderCount = userOrders.length;

    return NextResponse.json({
      success: true,
      message: 'Kampanya bilgileri güncellendi',
      orderCount: orderCount
    });
  } catch (error) {
    console.error('Campaigns POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Kampanya işlemi sırasında hata oluştu' },
      { status: 500 }
    );
  }
} 