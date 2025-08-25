import { prisma } from '../../../lib/prisma';
import { authenticateUser } from '../../../lib/auth';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET method
  if (req.method !== 'GET') {
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

    const orders = await prisma.order.findMany({
      where: {
        userId: user.userId
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('My Orders API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Siparişler yüklenirken bir hata oluştu'
    });
  }
}


