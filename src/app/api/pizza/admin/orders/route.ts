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

// Pizza admin token doğrulama
function verifyPizzaAdminToken(request: NextRequest) {
  const token = request.cookies.get('pizza_admin_token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'pizza_admin') {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`🍕 [${requestId}] Pizza Admin Orders API GET başladı`);
  
  try {
    const admin = verifyPizzaAdminToken(request);
    
    if (!admin) {
      return createErrorResponse(
        'Pizza admin yetkisi gereklidir',
        ERROR_CODES.TOKEN_INVALID,
        requestId,
        401
      );
    }

    const database = getDatabase();

    // Tüm siparişleri getir (kullanıcı bilgileriyle birlikte)
    const ordersResult = database.prepare(`
        SELECT o.*, 
               u.name as customer_name,
               u.email as customer_email,
               COUNT(oi.id) as item_count
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id, o.user_id, o.total_amount, o.status, o.delivery_address, o.phone, o.notes, o.created_at, u.name, u.email
        ORDER BY o.created_at DESC
      `).all();

    const orders = ordersResult.map((order: any) => ({
      id: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      total: parseFloat(order.total_amount),
      status: order.status,
      address: order.delivery_address,
      phone: order.phone,
      notes: order.notes,
      itemCount: order.item_count,
      createdAt: order.created_at,
      items: [] as any[]
    }));

    // Her sipariş için detayları getir
    for (let order of orders) {
      const itemsResult = database.prepare(`
          SELECT oi.*, p.name as product_name, p.image
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `).all(order.id);
      
      order.items = itemsResult.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        name: item.product_name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image
      }));
    }

    console.log(`✅ [${requestId}] ${orders.length} sipariş pizza admin için getirildi`);
    
    return createSuccessResponse(
      'Siparişler başarıyla getirildi',
      { orders },
      requestId,
      200
    );

  } catch (error) {
    console.error(`❌ [${requestId}] Pizza admin orders GET error:`, error);
    return createErrorResponse(
      'Siparişler alınamadı',
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      requestId,
      500
    );
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`🍕 [${requestId}] Pizza Admin Orders API PATCH başladı`);
  
  try {
    const admin = verifyPizzaAdminToken(request);
    
    if (!admin) {
      return createErrorResponse(
        'Pizza admin yetkisi gereklidir',
        ERROR_CODES.TOKEN_INVALID,
        requestId,
        401
      );
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return createErrorResponse(
        'Sipariş ID ve durum gereklidir',
        ERROR_CODES.VALIDATION_ERROR,
        requestId,
        400
      );
    }

    const database = getDatabase();
    
    // Siparişin var olduğunu kontrol et
    const order = database.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    
    if (!order) {
      return createErrorResponse(
        'Sipariş bulunamadı',
        ERROR_CODES.VALIDATION_ERROR,
        requestId,
        404
      );
    }

    // Sipariş durumunu güncelle
    database.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);

    console.log(`✅ [${requestId}] Pizza admin sipariş durumu güncellendi: ${orderId} -> ${status}`);
    
    return createSuccessResponse(
      'Sipariş durumu güncellendi',
      { orderId, status },
      requestId,
      200
    );

  } catch (error) {
    console.error(`❌ [${requestId}] Pizza admin orders PATCH error:`, error);
    return createErrorResponse(
      'Sipariş güncellenemedi',
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      requestId,
      500
    );
  }
}






