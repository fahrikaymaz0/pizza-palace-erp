import { prisma, ensurePrismaSqliteSchema } from '../../../lib/prisma';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'GET') { return res.status(405).json({ error: 'Method not allowed' }); }

  try {
    await ensurePrismaSqliteSchema();
    const rows = await prisma.$queryRawUnsafe(`SELECT value FROM "AppSetting" WHERE key='lastAdminEmail' LIMIT 1`);
    const value = Array.isArray(rows) && rows[0]?.value ? rows[0].value : '';
    res.status(200).json({ success: true, email: value });
  } catch (e) {
    res.status(200).json({ success: true, email: '' });
  }
}
