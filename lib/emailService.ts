// Email service utilities
import nodemailer from 'nodemailer';

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS; // App password önerilir

  if (!user || !pass) {
    console.warn('GMAIL_USER/GMAIL_PASS env değişkenleri set edilmemiş. Email gönderimi simüle edilecek.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  const transporter = createTransport();
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;background:#111;color:#fff;border:1px solid #7a0000;border-radius:12px">
      <h2 style="color:#e11d48;margin-top:0">Pizza Krallığı Doğrulama Kodu</h2>
      <p>Merhaba,</p>
      <p>Hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
      <div style="font-size:28px;letter-spacing:6px;background:#000;border:1px solid #7a0000;padding:12px;border-radius:8px;text-align:center;color:#fff">${code}</div>
      <p style="color:#9ca3af">Bu kod 10 dakika içinde geçerlidir. Siz değilseniz dikkate almayın.</p>
    </div>`;

  if (!transporter) {
    console.log(`[DEV] Verification code ${code} -> ${email}`);
    return true;
  }

  await transporter.sendMail({
    from: process.env.GMAIL_FROM || process.env.GMAIL_USER,
    to: email,
    subject: 'Pizza Krallığı - E-posta Doğrulama Kodu',
    html,
  });
  return true;
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const transporter = createTransport();
  const link = `${process.env.NEXT_PUBLIC_APP_URL || ''}/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;background:#111;color:#fff;border:1px solid #7a0000;border-radius:12px">
      <h2 style="color:#e11d48;margin-top:0">Pizza Krallığı Şifre Sıfırlama</h2>
      <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
      <p><a href="${link}" style="color:#e11d48">Şifreyi sıfırla</a></p>
    </div>`;

  if (!transporter) {
    console.log(`[DEV] Password reset link -> ${email}: ${link}`);
    return true;
  }

  await transporter.sendMail({
    from: process.env.GMAIL_FROM || process.env.GMAIL_USER,
    to: email,
    subject: 'Pizza Krallığı - Şifre Sıfırlama',
    html,
  });
  return true;
}


