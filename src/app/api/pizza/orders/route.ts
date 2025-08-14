import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/sqlite';
import { sendOrderConfirmationEmail } from '@/lib/emailService';
import {
  createSuccessResponse,
  createErrorResponse,
  ERROR_CODES,
  generateRequestId,
} from '@/lib/apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`📦 [${requestId}] Orders API GET başladı`);

  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return createErrorResponse(
        'Giriş yapmış olmanız gerekiyor',
        ERROR_CODES.TOKEN_INVALID,
        requestId,
        401
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const database = getDatabase();

    // Kullanıcının siparişlerini getir
    const ordersResult = database
      .prepare(
        `
        SELECT o.*, 
               COUNT(oi.id) as item_count
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?
        GROUP BY o.id, o.user_id, o.total_amount, o.status, o.delivery_address, o.phone, o.notes, o.created_at
        ORDER BY o.created_at DESC
      `
      )
      .all(decoded.userId);

    console.log(`📦 [${requestId}] Raw orders result:`, ordersResult);

    const orders = ordersResult.map((order: any) => ({
      id: order.id,
      total: parseFloat(order.total_amount),
      status: order.status,
      address: order.delivery_address,
      phone: order.phone,
      notes: order.notes,
      itemCount: order.item_count,
      createdAt: order.created_at,
      payment: order.payment_card_number
        ? {
            cardNumber: order.payment_card_number,
            cardHolder: order.payment_card_holder,
            expiryDate: order.payment_expiry_date,
            cvv: order.payment_cvv,
          }
        : undefined,
      transaction: order.transaction_id
        ? {
            transactionId: order.transaction_id,
            authCode: order.auth_code,
            bank: order.payment_bank,
            paymentMethod: order.payment_method,
          }
        : undefined,
      items: [] as any[],
    }));

    // Her sipariş için detayları getir
    for (let order of orders) {
      const itemsResult = database
        .prepare(
          `
          SELECT oi.*, p.name as product_name, p.image
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `
        )
        .all(order.id);

      order.items = itemsResult.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        name: item.product_name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image,
      }));
    }

    console.log(`✅ [${requestId}] ${orders.length} sipariş getirildi`);
    console.log(`📦 [${requestId}] Orders data:`, orders);

    const response = createSuccessResponse(
      'Siparişler başarıyla getirildi',
      { orders },
      requestId,
      200
    );

    console.log(`📦 [${requestId}] Response created:`, response);
    return response;
  } catch (error) {
    console.error(`❌ [${requestId}] Orders GET error:`, error);
    return createErrorResponse(
      'Siparişler alınamadı',
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      requestId,
      500
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`📦 [${requestId}] Orders API POST başladı`);

  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return createErrorResponse(
        'Giriş yapmış olmanız gerekiyor',
        ERROR_CODES.TOKEN_INVALID,
        requestId,
        401
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const body = await request.json();
    const {
      items,
      address,
      phone,
      notes,
      delivery_address,
      total_amount,
      payment,
      transactionInfo,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return createErrorResponse(
        'Sipariş öğeleri gereklidir',
        ERROR_CODES.VALIDATION_ERROR,
        requestId,
        400
      );
    }

    // Adres ve telefon bilgilerini farklı formatlardan al
    const deliveryAddress = address || delivery_address;
    const phoneNumber = phone;

    if (!deliveryAddress || !phoneNumber) {
      return createErrorResponse(
        'Adres ve telefon bilgileri gereklidir',
        ERROR_CODES.VALIDATION_ERROR,
        requestId,
        400
      );
    }

    const database = getDatabase();

    // Toplam tutarı hesapla veya gelen değeri kullan
    let total = total_amount || 0;
    if (!total_amount) {
      for (const item of items) {
        const product = database
          .prepare('SELECT price FROM products WHERE id = ?')
          .get(item.id) as any;
        if (!product) {
          return createErrorResponse(
            `Ürün bulunamadı: ${item.id}`,
            ERROR_CODES.VALIDATION_ERROR,
            requestId,
            400
          );
        }
        total += parseFloat(product.price) * item.quantity;
      }
    }

    // Transaction başlat
    database.prepare('BEGIN TRANSACTION').run();

    try {
      // Ana sipariş kaydı
      const orderResult = database
        .prepare(
          `
        INSERT INTO orders (user_id, total_amount, status, delivery_address, phone, notes, payment_card_number, payment_card_holder, payment_expiry_date, payment_cvv, transaction_id, auth_code, payment_bank, payment_method) 
        VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          decoded.userId,
          total,
          deliveryAddress,
          phoneNumber,
          notes || '',
          payment?.cardNumber || '',
          payment?.cardHolder || '',
          payment?.expiryDate || '',
          payment?.cvv || '',
          transactionInfo?.transactionId || '',
          transactionInfo?.authCode || '',
          transactionInfo?.bank || '',
          transactionInfo?.paymentMethod || 'credit_card'
        );

      const orderId = orderResult.lastInsertRowid;

      // Sipariş öğelerini ekle
      for (const item of items) {
        const product = database
          .prepare('SELECT price FROM products WHERE id = ?')
          .get(item.id) as any;
        database
          .prepare(
            `
          INSERT INTO order_items (order_id, product_id, quantity, price) 
          VALUES (?, ?, ?, ?)
        `
          )
          .run(orderId, item.id, item.quantity, product.price);
      }

      database.prepare('COMMIT').run();
      console.log(
        `✅ [${requestId}] Sipariş başarıyla oluşturuldu: ${orderId}`
      );

      // Email gönder (hata olsa bile sipariş oluşturulmuş olur)
      try {
        const user = database
          .prepare('SELECT name, email FROM users WHERE id = ?')
          .get(decoded.userId) as any;
        if (user && user.email) {
          await sendOrderConfirmationEmail(user.email, user.name, {
            id: orderId,
            total: total,
            items: items,
          });
          console.log(
            `📧 [${requestId}] Sipariş onay emaili gönderildi: ${user.email}`
          );
        }
      } catch (emailError) {
        console.error(
          `⚠️ [${requestId}] Email gönderme hatası (sipariş yine de oluşturuldu):`,
          emailError
        );
      }

      return createSuccessResponse(
        'Sipariş başarıyla oluşturuldu',
        {
          orderId,
          message: 'Siparişiniz alındı ve hazırlanmaya başladı',
        },
        requestId,
        201
      );
    } catch (error) {
      database.prepare('ROLLBACK').run();
      throw error;
    }
  } catch (error) {
    console.error(`❌ [${requestId}] Orders POST error:`, error);
    return createErrorResponse(
      'Sipariş oluşturulamadı',
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      requestId,
      500
    );
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`📦 [${requestId}] Orders API PATCH başladı`);

  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return createErrorResponse(
        'Giriş yapmış olmanız gerekiyor',
        ERROR_CODES.TOKEN_INVALID,
        requestId,
        401
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
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

    // Siparişin kullanıcıya ait olduğunu kontrol et
    const order = database
      .prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?')
      .get(orderId, decoded.userId);

    if (!order) {
      return createErrorResponse(
        'Sipariş bulunamadı',
        ERROR_CODES.VALIDATION_ERROR,
        requestId,
        404
      );
    }

    // Sipariş durumunu güncelle
    database
      .prepare('UPDATE orders SET status = ? WHERE id = ?')
      .run(status, orderId);

    console.log(
      `✅ [${requestId}] Sipariş durumu güncellendi: ${orderId} -> ${status}`
    );

    return createSuccessResponse(
      'Sipariş durumu güncellendi',
      { orderId, status },
      requestId,
      200
    );
  } catch (error) {
    console.error(`❌ [${requestId}] Orders PATCH error:`, error);
    return createErrorResponse(
      'Sipariş güncellenemedi',
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      requestId,
      500
    );
  }
}
