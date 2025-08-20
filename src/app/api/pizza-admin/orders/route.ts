import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/sqlite';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Pizza admin token kontrolü
function verifyPizzaAdminToken(request: NextRequest) {
  try {
    const token = request.cookies.get('pizza_admin_token')?.value;
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'pizza_admin') {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Pizza admin yetkisi kontrolü
    const user = verifyPizzaAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const database = getDatabase();

    // Tüm siparişleri kullanıcı bilgileriyle birlikte getir
    const orders = database
      .prepare(
        `
      SELECT 
        o.id,
        o.user_id,
        o.total_amount,
        o.status,
        o.delivery_address,
        o.phone,
        o.notes,
        o.created_at,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `
      )
      .all() as any[];

    // Her sipariş için ürün detaylarını getir
    const ordersWithItems = orders.map(order => {
      const items = database
        .prepare(
          `
        SELECT 
          oi.id,
          oi.quantity,
          oi.price,
          p.name as product_name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `
        )
        .all(order.id) as any[];

      return {
        ...order,
        items,
      };
    });

    return NextResponse.json({
      success: true,
      orders: ordersWithItems,
      total: ordersWithItems.length,
    });
  } catch (error) {
    console.error('Pizza admin orders error:', error);
    return NextResponse.json(
      { error: 'Siparişler yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}




