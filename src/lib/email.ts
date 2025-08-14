import nodemailer from 'nodemailer';

// Email transporter oluştur
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true, // SSL true
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Hoş geldin emaili gönder
export const sendWelcomeEmail = async (email: string, name: string, clientId: string) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Dinamik ERP Sistemine Hoş Geldiniz! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Hoş Geldiniz!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Dinamik ERP sisteminiz başarıyla oluşturuldu</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${name},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Dinamik ERP sisteminiz başarıyla oluşturuldu! Artık işletmenizi yönetmek için güçlü araçlara sahipsiniz.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin: 0 0 10px 0;">Sistem Bilgileriniz:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Müşteri ID:</strong> ${clientId}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${email}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Admin Paneline Git
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
                Bu email Dinamik ERP sistemi tarafından otomatik olarak gönderilmiştir.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Hoş geldin emaili gönderildi:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Email gönderimi hatası:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Bilinmeyen hata' };
  }
};