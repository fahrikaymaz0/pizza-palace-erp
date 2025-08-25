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
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0b0c;padding:40px 0;">
        <tr>
          <td>
            <table role="presentation" width="560" align="center" cellspacing="0" cellpadding="0" style="background:#111217;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.4);font-family:Inter,Arial,sans-serif;color:#e5e7eb;">
              <tr>
                <td style="padding:28px 32px;border-bottom:1px solid #1f2937;background:linear-gradient(90deg,#7c2d12,#b91c1c);border-radius:16px 16px 0 0;">
                  <table width="100%"><tr>
                    <td style="font-size:0;">
                      <div style="display:inline-block;vertical-align:middle;width:48px;height:48px;background:#fff;border-radius:12px;text-align:center;line-height:48px;font-size:26px;">🍕</div>
                      <div style="display:inline-block;vertical-align:middle;padding-left:12px;">
                        <div style="font-size:18px;font-weight:700;color:#fff;">Pizza Krallığı</div>
                        <div style="font-size:12px;color:#fde68a;opacity:.9;">E‑posta Doğrulama</div>
                      </div>
                    </td>
                  </tr></table>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 32px;">
                  <h1 style="margin:0 0 6px 0;font-size:22px;color:#fff;">Hesabınızı Doğrulayın</h1>
                  <p style="margin:0 0 18px 0;font-size:14px;color:#cbd5e1;line-height:1.6;">Güvenliğinizi sağlamak için aşağıdaki tek kullanımlık kodu 10 dakika içinde girin.</p>
                  <div style="margin:16px 0;padding:18px 24px;background:#0f172a;border:1px solid #334155;border-radius:12px;text-align:center;">
                    <div style="letter-spacing:10px;font-size:34px;font-weight:800;color:#fde68a;text-shadow:0 2px 8px rgba(253,230,138,.25);">${code}</div>
                  </div>
                  <p style="margin:0;font-size:12px;color:#94a3b8;">Kod sizin isteğiniz dışında geldiyse bu e‑postayı yok sayın.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 32px 28px 32px;border-top:1px solid #1f2937;color:#9ca3af;font-size:12px;border-radius:0 0 16px 16px;">
                  © ${new Date().getFullYear()} Pizza Krallığı • Tüm hakları saklıdır
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;

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

