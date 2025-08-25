import { prisma, ensurePrismaSqliteSchema } from '../../../lib/prisma';

// Server-Sent Events: ?roomId=...&after=timestamp
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { roomId, after } = req.query;
  if (!roomId) return res.status(400).end('roomId required');
  await ensurePrismaSqliteSchema();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  let isClosed = false;
  req.on('close', () => { isClosed = true; });

  const send = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // İlk yükleme: son mesajları gönder
  async function tick() {
    if (isClosed) return;
    try {
      const since = after ? new Date(after) : new Date(Date.now() - 60 * 60 * 1000);
      const messages = await prisma.chatMessage.findMany({
        where: { roomId, createdAt: { gt: since } },
        orderBy: { createdAt: 'asc' }
      });
      if (messages.length) send('messages', messages);
    } catch (e) {
      // hata bastırma, bağlantı kopmasın
    }
    if (!isClosed) setTimeout(tick, 2500);
  }

  send('hello', { ok: true });
  tick();
}

