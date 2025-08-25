import { prisma } from '../../../lib/prisma';
import { generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'E-posta ve kod gereklidir' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.emailVerified) {
      return res.status(400).json({ success: false, message: 'Geçersiz istek' });
    }

    if (user.verificationCode !== code) {
      return res.status(401).json({ success: false, message: 'Onay kodu hatalı' });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationCode: null },
      select: { id: true, firstName: true, lastName: true, email: true, role: true }
    });

    const token = generateToken(updated.id, updated.email, updated.role);

    return res.status(200).json({ success: true, message: 'E-posta doğrulandı', user: updated, token });
  } catch (error) {
    console.error('Verify API Error:', error);
    return res.status(500).json({ success: false, message: 'Doğrulama sırasında hata oluştu' });
  }
}




