import { prisma, ensurePrismaSqliteSchema } from '../../../lib/prisma';
import { authenticateUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await ensurePrismaSqliteSchema();
    const auth = authenticateUser(req);
    const { userId } = req.body || {};

    const room = await prisma.chatRoom.create({
      data: {
        userId: auth?.id || userId || null
      }
    });

    return res.status(201).json({ success: true, room });
  } catch (e) {
    console.error('create-room error:', e);
    return res.status(500).json({ success: false, message: 'Sohbet odası oluşturulamadı' });
  }
}

