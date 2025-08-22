import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Admin kontrolü (gerçek uygulamada JWT token kontrolü yapılmalı)
    const messages = await prisma.supportMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({ 
      success: true, 
      messages: messages 
    });

  } catch (error) {
    console.error('Mesaj getirme hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Mesajlar getirilirken hata oluştu' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
