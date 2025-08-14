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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Pizza admin yetkisi kontrolü
    const user = verifyPizzaAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Geçersiz sipariş ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Durum bilgisi gerekli' },
        { status: 400 }
      );
    }

    // Geçerli durumlar
    const validStatuses = [-1, 0, 1, 2, 3];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz durum' },
        { status: 400 }
      );
    }

    const database = getDatabase();

    // Siparişin var olup olmadığını kontrol et
    const existingOrder = database.prepare('SELECT id FROM orders WHERE id = ?').get(orderId) as any;
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    // Sipariş durumunu güncelle
    database.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);

    // Güncellenmiş siparişi getir
    const updatedOrder = database.prepare(`
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
      WHERE o.id = ?
    `).get(orderId) as any;

    return NextResponse.json({
      success: true,
      message: 'Sipariş durumu güncellendi',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Pizza admin order update error:', error);
    return NextResponse.json(
      { error: 'Sipariş güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}
