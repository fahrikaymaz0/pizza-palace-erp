import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

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
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
    }

    const { orderId, paymentMethod, paymentDetails } = req.body;

    console.log('Payment processing attempt:', { orderId, paymentMethod });

    // Validation
    if (!orderId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Sipariş ID ve ödeme yöntemi gereklidir'
      });
    }

    // Find order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
    }

    // Check if order belongs to user
    if (order.userId !== decoded.id && decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu siparişe erişim yetkiniz yok'
      });
    }

    // Check if already paid
    if (order.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Bu sipariş zaten ödenmiş'
      });
    }

    // Simulate payment processing
    let paymentSuccess = false;
    let paymentMessage = '';

    switch (paymentMethod) {
      case 'cash':
        paymentSuccess = true;
        paymentMessage = 'Nakit ödeme kabul edildi';
        break;
      case 'card':
        // Simulate card payment
        if (paymentDetails && paymentDetails.cardNumber && paymentDetails.cvv) {
          paymentSuccess = true;
          paymentMessage = 'Kart ödemesi başarılı';
        } else {
          paymentSuccess = false;
          paymentMessage = 'Kart bilgileri eksik';
        }
        break;
      case 'online':
        // Simulate online payment
        paymentSuccess = true;
        paymentMessage = 'Online ödeme başarılı';
        break;
      default:
        paymentSuccess = false;
        paymentMessage = 'Geçersiz ödeme yöntemi';
    }

    if (!paymentSuccess) {
      return res.status(400).json({
        success: false,
        message: paymentMessage
      });
    }

    // Update order payment status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'completed',
        paymentMethod,
        status: 'preparing' // Move to preparing after payment
      },
      include: {
        items: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    console.log('Payment processed:', orderId);

    return res.status(200).json({
      success: true,
      message: paymentMessage,
      order: {
        id: updatedOrder.id,
        customerName: updatedOrder.customerName,
        totalPrice: updatedOrder.totalPrice,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        paymentMethod: updatedOrder.paymentMethod,
        createdAt: updatedOrder.createdAt
      }
    });

  } catch (error) {
    console.error('Payment processing API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ödeme işlemi sırasında bir hata oluştu'
    });
  }
}

