import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Admin kontrolü (gerçek uygulamada JWT token kontrolü yapılmalı)
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Siparişleri formatla
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customerName: order.customerName || order.user?.name || 'Anonim',
      customerEmail: order.customerEmail || order.user?.email || '',
      customerPhone: order.customerPhone || order.user?.phone || '',
      deliveryAddress: order.deliveryAddress,
      totalPrice: order.totalPrice,
      status: order.status,
      customerMessage: order.customerMessage,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    res.status(200).json({ 
      success: true, 
      orders: formattedOrders 
    });

  } catch (error) {
    console.error('Sipariş getirme hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Siparişler getirilirken hata oluştu' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
