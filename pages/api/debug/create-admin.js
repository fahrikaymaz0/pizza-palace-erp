import { prisma, ensurePrismaSqliteSchema, ensureUserLastLoginColumn } from '../../../lib/prisma';
import { hashPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  try {
    await ensurePrismaSqliteSchema();
    await ensureUserLastLoginColumn();
    const email = 'admin@pizzakralligi.com';
    const exist = await prisma.user.findFirst({ where: { email } });
    if (exist && exist.role === 'admin') {
      return res.status(200).json({ ok: true, message: 'Admin already exists', id: exist.id });
    }
    const hashed = await hashPassword('Admin123!');
    const admin = exist
      ? await prisma.user.update({ where: { id: exist.id }, data: { role: 'admin', password: hashed, emailVerified: true } })
      : await prisma.user.create({ data: { firstName: 'Admin', lastName: 'Root', email, password: hashed, role: 'admin', emailVerified: true } });
    res.status(201).json({ ok: true, id: admin.id, email });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}


