import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/sqlite';
import jwt from 'jsonwebtoken';
import { createSuccessResponse, createErrorResponse, generateRequestId } from '@/lib/apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  console.log(`❌ [${requestId}] Sipariş iptal API başladı - Sipariş ID: ${params.id}`);
  
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return createErrorResponse(
        'Giriş yapmış olmanız gerekiyor',
        'TOKEN_INVALID',
        requestId,
        401
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return createErrorResponse(
        'Geçersiz sipariş ID',
        'VALIDATION_ERROR',
        requestId,
        400
      );
    }

    const database = getDatabase();
    
    // Siparişin kullanıcıya ait olduğunu ve onay beklediğini kontrol et
    const order = database.prepare(`
      SELECT id, user_id, status, total_amount
      FROM orders 
      WHERE id = ? AND user_id = ? AND status = 0
    `).get(orderId, decoded.userId) as any;

    if (!order) {
      return createErrorResponse(
        'Sipariş bulunamadı veya iptal edilemez',
        'ORDER_NOT_FOUND',
        requestId,
        404
      );
    }

    // Siparişi iptal et (status = -1)
    const result = database.prepare(`
      UPDATE orders SET status = -1 WHERE id = ?
    `).run(orderId);

    if (result.changes === 0) {
      return createErrorResponse(
        'Sipariş iptal edilemedi',
        'UPDATE_FAILED',
        requestId,
        500
      );
    }

    console.log(`✅ [${requestId}] Sipariş #${orderId} başarıyla iptal edildi`);

    return createSuccessResponse(
      'Sipariş başarıyla iptal edildi',
      { 
        orderId,
        message: 'Siparişiniz iptal edildi'
      },
      requestId,
      200
    );

  } catch (error) {
    console.error(`❌ [${requestId}] Sipariş iptal hatası:`, error);
    return createErrorResponse(
      'Sipariş iptal edilirken hata oluştu',
      'INTERNAL_SERVER_ERROR',
      requestId,
      500
    );
  }
}



