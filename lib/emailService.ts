// Email service utilities
import nodemailer from 'nodemailer';

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createTransport() {
  const emailUser = process.env.EMAIL_USER || 'pizzapalaceofficial00@gmail.com';
  const emailPass = process.env.EMAIL_PASS || 'scgwevbmztpahfoc';

  if (!emailUser || !emailPass) {
    console.warn('EMAIL_USER/EMAIL_PASS env değişkenleri set edilmemiş. Email gönderimi simüle edilecek.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: emailUser, pass: emailPass },
  });
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const transporter = createTransport();
    const emailUser = process.env.EMAIL_USER || 'pizzapalaceofficial00@gmail.com';
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;background:#fff;color:#333;border:2px solid #dc2626;border-radius:12px">
        <div style="text-align:center;margin-bottom:20px;">
          <h1 style="color:#dc2626;margin:0;font-size:28px;">🍕 Pizza Krallığı</h1>
        </div>
        <h2 style="color:#dc2626;margin-top:0;text-align:center;">E-posta Doğrulama Kodu</h2>
        <p>Merhaba,</p>
        <p>Hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
        <div style="font-size:32px;letter-spacing:8px;background:#fef3c7;border:2px solid #f59e0b;padding:20px;border-radius:12px;text-align:center;color:#92400e;font-weight:bold;margin:20px 0;">${code}</div>
        <p style="color:#6b7280;font-size:14px;">Bu kod 10 dakika içinde geçerlidir. Siz değilseniz dikkate almayın.</p>
        <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb;">
          <p style="color:#6b7280;font-size:12px;">Pizza Krallığı - Kraliyet Lezzetlerin Adresi</p>
        </div>
      </div>`;

    if (!transporter) {
      console.log(`[DEV] Verification code ${code} -> ${email}`);
      return true;
    }

    const result = await transporter.sendMail({
      from: `"Pizza Krallığı" <${emailUser}>`,
      to: email,
      subject: '🍕 Pizza Krallığı - E-posta Doğrulama Kodu',
      html,
    });

    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  try {
    const transporter = createTransport();
    const emailUser = process.env.EMAIL_USER || 'pizzapalaceofficial00@gmail.com';
    const link = `${process.env.NEXT_PUBLIC_APP_URL || 'https://pizza-palace-erp-phi.vercel.app'}/reset-password?token=${resetToken}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;background:#fff;color:#333;border:2px solid #dc2626;border-radius:12px">
        <div style="text-align:center;margin-bottom:20px;">
          <h1 style="color:#dc2626;margin:0;font-size:28px;">🍕 Pizza Krallığı</h1>
        </div>
        <h2 style="color:#dc2626;margin-top:0;text-align:center;">Şifre Sıfırlama</h2>
        <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
        <div style="text-align:center;margin:20px 0;">
          <a href="${link}" style="background:#dc2626;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">Şifreyi Sıfırla</a>
        </div>
        <p style="color:#6b7280;font-size:14px;">Bu bağlantı 1 saat içinde geçerlidir. Siz değilseniz dikkate almayın.</p>
        <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb;">
          <p style="color:#6b7280;font-size:12px;">Pizza Krallığı - Kraliyet Lezzetlerin Adresi</p>
        </div>
      </div>`;

    if (!transporter) {
      console.log(`[DEV] Password reset link -> ${email}: ${link}`);
      return true;
    }

    const result = await transporter.sendMail({
      from: `"Pizza Krallığı" <${emailUser}>`,
      to: email,
      subject: '🍕 Pizza Krallığı - Şifre Sıfırlama',
      html,
    });

    console.log('Password reset email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Password reset email sending failed:', error);
    return false;
  }
}
