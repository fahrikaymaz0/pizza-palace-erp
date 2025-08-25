import { prisma, ensurePrismaSqliteSchema } from '../../../lib/prisma';
import { authenticateUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({});
  try {
    await ensurePrismaSqliteSchema();
    const auth = authenticateUser(req);
    const where = auth?.role === 'admin' ? {} : { userId: auth?.id || null };
    const rooms = await prisma.chatRoom.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    return res.status(200).json({ success: true, rooms });
  } catch (e) {
    console.error('rooms error:', e);
    return res.status(500).json({ success: false });
  }
}

