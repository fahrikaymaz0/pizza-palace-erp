import nodemailer from 'nodemailer';
import { getDatabase } from './sqlite';

// Email gönderim konfigürasyonu
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pizzapalaceofficial00@gmail.com',
    pass: 'scgwevbmztpahfoc'
  }
});

// Transporter'ın çalıştığını test et
transporter.verify((error, success) => {
  if (error) {
    console.error('Email konfigürasyon hatası:', error);
  } else {
    console.log('✅ Email sistemi hazır');
  }
});

// 6 haneli random kod üretme
export const generateCode = (): string => {
  // Her zaman random 6 haneli kod üret
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email gönderme
export const sendVerificationEmail = async (
  email: string, 
  code: string, 
  userName: string = 'Kullanıcı'
): Promise<boolean> => {
  const mailOptions = {
    from: 'pizzapalaceofficial00@gmail.com',
    to: email,
    subject: 'Pizza Palace - Email Doğrulama Kodu',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f7f7f7; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🍕 Pizza Palace</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Email Doğrulama Kodu</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px; font-size: 24px;">Merhaba ${userName}! 👋</h2>
          
          <p style="color: #666; line-height: 1.8; margin-bottom: 30px; font-size: 16px;">
            Pizza Palace'a hoş geldiniz! Email adresinizi doğrulamak için aşağıdaki kodu kullanın:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="background: linear-gradient(135deg, #fef3c7, #fed7aa); padding: 25px; border-radius: 15px; display: inline-block; border: 2px solid #f97316;">
              <p style="color: #9a3412; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">DOĞRULAMA KODU</p>
              <h3 style="color: #dc2626; margin: 0; font-size: 32px; letter-spacing: 8px; font-weight: bold;">${code}</h3>
            </div>
          </div>
          
          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0; border-radius: 8px;">
            <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.6;">
              <strong>⚠️ Önemli:</strong> Bu kod 15 dakika geçerlidir. Güvenliğiniz için bu kodu kimseyle paylaşmayın.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Bu email'i siz talep etmediyseniz, lütfen dikkate almayın.
            </p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f3f4f6; margin: 30px 0;">
          
          <div style="text-align: center; color: #999; font-size: 12px; line-height: 1.6;">
            <p style="margin: 5px 0;"><strong>🍕 Pizza Palace</strong></p>
            <p style="margin: 5px 0;">Lezzetin Adresi</p>
            <p style="margin: 5px 0;">Bu email otomatik olarak gönderilmiştir.</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    console.log(`📧 Email gönderiliyor: ${email}`);
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email başarıyla gönderildi: ${email} -> MessageId: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Email gönderme hatası:', error);
    return false;
  }
};

// Verification code storage interface
interface VerificationData {
  code: string;
  expiresAt: number;
      userData?: {
      name: string;
      email: string;
      password: string;
      type?: string;
    };
}

// Geçici kod saklama (production'da database kullanın)
const verificationCodes = new Map<string, VerificationData>();

// Kod kaydetme
export const saveCode = (email: string, code: string): void => {
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 dakika
  verificationCodes.set(email, { code, expiresAt });
  console.log(`💾 Kod kaydedildi: ${email} -> ${code} (Süre: 15 dakika)`);
};

// Kullanıcı verisiyle kod kaydetme (SQLite Database)
export const saveCodeWithUserData = async (email: string, code: string, userData: { name: string; email: string; password: string; type?: string }): Promise<boolean> => {
  try {
    const database = getDatabase();
    
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika
    const userDataJson = JSON.stringify(userData);
    
    database.prepare(`
      INSERT INTO verification_codes (user_id, email, code, type, user_data, expires_at, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      null, // user_id henüz yok, kayıt sırasında null
      email.toLowerCase(),
      code,
      userData.type || 'registration',
      userDataJson,
      expiresAt.toISOString(),
      new Date().toISOString()
    );
    
    console.log(`💾 Kod ve kullanıcı verisi SQLite DATABASE'e kaydedildi: ${email} -> ${code} (Süre: 15 dakika)`);
    return true;
  } catch (error) {
    console.error('SQLite Database kod kaydetme hatası:', error);
    return false;
  }
};

// Kod doğrulama (SQLite Database)
export const verifyCode = async (email: string, inputCode: string): Promise<{ valid: boolean; message: string; userData?: any }> => {
  try {
    const database = getDatabase();
    
    // Kod ve kullanıcı verilerini getir
    const result = database.prepare(`
      SELECT code, type, user_data, expires_at 
      FROM verification_codes 
      WHERE email = ?
    `).get(email.toLowerCase());
    
    if (!result) {
      console.log(`❌ Kod SQLite DATABASE'de bulunamadı: ${email}`);
      return { valid: false, message: 'Kod bulunamadı veya süresi dolmuş' };
    }
    
    // Süre kontrolü
    if (new Date() > new Date(result.expires_at)) {
      database.prepare('DELETE FROM verification_codes WHERE email = ?').run(email.toLowerCase());
      console.log(`⏰ Kod süresi dolmuş: ${email}`);
      return { valid: false, message: 'Kodun süresi dolmuş' };
    }
    
    // Kod kontrolü
    if (result.code !== inputCode) {
      console.log(`❌ Yanlış kod: ${email} -> Beklenen: ${result.code}, Girilen: ${inputCode}`);
      return { valid: false, message: 'Yanlış kod' };
    }
    
    // Kod doğru, userData'yı al ve sonra sil
    const userData = result.user_data ? JSON.parse(result.user_data) : null;
    
    // Kod doğrulandıktan sonra sil
    database.prepare('DELETE FROM verification_codes WHERE email = ?').run(email.toLowerCase());
    
    console.log(`✅ Kod SQLite DATABASE'den doğrulandı: ${email}`);
    return { valid: true, message: 'Email doğrulandı', userData };
    
  } catch (error) {
    console.error('SQLite Database kod doğrulama hatası:', error);
    return { valid: false, message: 'Kod doğrulama sırasında hata oluştu' };
  }
};

// Order confirmation email
export const sendOrderConfirmationEmail = async (
  email: string,
  userName: string,
  orderDetails: any
): Promise<boolean> => {
  const mailOptions = {
    from: 'pizzapalaceofficial00@gmail.com',
    to: email,
    subject: 'Pizza Palace - Sipariş Onayı',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">🍕 Pizza Palace</h1>
          <p style="margin: 10px 0 0 0;">Sipariş Onayı</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Siparişiniz başarıyla alındı ve hazırlanmaya başladı.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Sipariş Detayları</h3>
            <p style="margin: 5px 0;"><strong>Sipariş No:</strong> ${orderDetails.id}</p>
            <p style="margin: 5px 0;"><strong>Toplam Tutar:</strong> ${orderDetails.total}₺</p>
            <p style="margin: 5px 0;"><strong>Tahmini Teslimat:</strong> 30-45 dakika</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Siparişinizi takip etmek için web sitemizden "Siparişlerim" bölümünü ziyaret edebilirsiniz.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <div style="text-align: center; color: #999; font-size: 12px;">
            <p>Pizza Palace - Lezzetin Adresi</p>
            <p>Bu email otomatik olarak gönderilmiştir.</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Sipariş onay emaili gönderildi: ${email} -> MessageId: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Sipariş onay emaili gönderme hatası:', error);
    return false;
  }
};

// Password reset email
export const sendPasswordResetEmail = async (
  email: string,
  code: string,
  userName: string = 'Kullanıcı'
): Promise<boolean> => {
  const mailOptions = {
    from: 'pizzapalaceofficial00@gmail.com',
    to: email,
    subject: 'Pizza Palace - Şifre Sıfırlama',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f7f7f7; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #f97316); color: white; padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🔐 Pizza Palace</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Şifre Sıfırlama</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px; font-size: 24px;">Merhaba ${userName}! 🔑</h2>
          
          <p style="color: #666; line-height: 1.8; margin-bottom: 30px; font-size: 16px;">
            Şifrenizi sıfırlamak için aşağıdaki kodu kullanın:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="background: linear-gradient(135deg, #fef3c7, #fed7aa); padding: 25px; border-radius: 15px; display: inline-block; border: 2px solid #dc2626;">
              <p style="color: #9a3412; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">ŞİFRE SIFIRLAMA KODU</p>
              <h3 style="color: #dc2626; margin: 0; font-size: 32px; letter-spacing: 8px; font-weight: bold;">${code}</h3>
            </div>
          </div>
          
          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0; border-radius: 8px;">
            <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.6;">
              <strong>⚠️ Güvenlik Uyarısı:</strong> Bu kod 15 dakika geçerlidir. Bu işlemi siz yapmadıysanız, lütfen bu email'i dikkate almayın ve hesap güvenliğiniz için şifrenizi değiştirin.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Bu kodu kimseyle paylaşmayın ve güvenli bir yerde saklayın.
            </p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #f3f4f6; margin: 30px 0;">
          
          <div style="text-align: center; color: #999; font-size: 12px; line-height: 1.6;">
            <p style="margin: 5px 0;"><strong>🍕 Pizza Palace</strong></p>
            <p style="margin: 5px 0;">Lezzetin Adresi</p>
            <p style="margin: 5px 0;">Bu email otomatik olarak gönderilmiştir.</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    console.log(`🔐 Şifre sıfırlama emaili gönderiliyor: ${email}`);
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Şifre sıfırlama emaili başarıyla gönderildi: ${email} -> MessageId: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Şifre sıfırlama emaili gönderme hatası:', error);
    return false;
  }
};
