import { prisma, ensurePrismaSqliteSchema } from '../../../lib/prisma';
import { authenticateUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    await ensurePrismaSqliteSchema();
    const auth = authenticateUser(req);
    const { roomId, text, sender } = req.body;
    if (!roomId || !text) return res.status(400).json({ success: false, message: 'roomId ve text zorunlu' });

    const finalSender = sender || (auth?.role === 'admin' ? 'admin' : 'user');
    const message = await prisma.chatMessage.create({
      data: { roomId, text, sender: finalSender }
    });

    // Basit publish: SSE dinleyenler poll ile alacak
    return res.status(201).json({ success: true, message });
  } catch (e) {
    console.error('chat send error:', e);
    return res.status(500).json({ success: false });
  }
}

