import { prisma } from '../../../lib/prisma';
import { authenticateUser } from '../../../lib/auth';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const user = authenticateUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Giriş yapmanız gereklidir'
      });
    }

    const { items, shippingAddress, phone, notes } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Sipariş öğeleri gereklidir'
      });
    }

    if (!shippingAddress || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Teslimat adresi ve telefon numarası gereklidir'
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      // Get product details
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true, price: true, isActive: true }
      });

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Ürün bulunamadı: ${item.productId}`
        });
      }

      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Geçersiz ürün miktarı'
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        status: 'PENDING',
        totalAmount,
        shippingAddress,
        phone,
        notes: notes || null,
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true
              }
            }
          }
        }
      }
    });

    console.log('New order created:', order.id, 'for user:', user.userId);

    return res.status(201).json({
      success: true,
      message: 'Sipariş başarıyla oluşturuldu',
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        items: order.items,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Create Order API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Sipariş oluşturulurken bir hata oluştu'
    });
  }
}

