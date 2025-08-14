import nodemailer from 'nodemailer';

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pizzapalaceofficial00@gmail.com',
    pass: 'scgwevbmztpahfoc'
  }
});

// Email doğrulama kodu gönderme
export async function sendVerificationEmail(email: string, verificationCode: string, userName: string): Promise<boolean> {
  try {
    console.log(`Email gönderiliyor: ${email} -> ${verificationCode}`);
    
    const mailOptions = {
      from: 'pizzapalaceofficial00@gmail.com',
      to: email,
      subject: 'Pizza Palace - Email Doğrulama',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🍕 Pizza Palace</h1>
            <p style="margin: 10px 0 0 0;">Email Doğrulama</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Email adresinizi doğrulamak için aşağıdaki kodu kullanın:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; display: inline-block;">
                <h3 style="color: #333; margin: 0; font-size: 24px; letter-spacing: 5px;">${verificationCode}</h3>
              </div>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Bu kod 10 dakika geçerlidir. Bu email'i siz talep etmediyseniz, lütfen dikkate almayın.
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

    const result = await transporter.sendMail(mailOptions);
    console.log(`Doğrulama email'i gönderildi: ${email} -> MessageId: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error('Email gönderme hatası:', error);
    return false;
  }
}

// Sipariş onay emaili gönderme
export async function sendOrderConfirmationEmail(email: string, orderData: any, userName: string): Promise<boolean> {
  try {
    console.log(`Sipariş email'i gönderiliyor: ${email}`);
    
    const mailOptions = {
      from: 'pizzapalaceofficial00@gmail.com',
      to: email,
      subject: `Pizza Palace - Sipariş Onayı #${orderData.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🍕 Pizza Palace</h1>
            <p style="margin: 10px 0 0 0;">Sipariş Onayı</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Siparişiniz başarıyla alındı ve hazırlanmaya başlandı.
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Sipariş Detayları</h3>
              <p><strong>Sipariş No:</strong> #${orderData.id}</p>
              <p><strong>Tarih:</strong> ${new Date(orderData.created_at).toLocaleDateString('tr-TR')}</p>
              <p><strong>Durum:</strong> ${getStatusText(orderData.status)}</p>
              <p><strong>Toplam:</strong> ${formatPrice(orderData.total)}</p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Sipariş Edilen Ürünler</h3>
              ${orderData.items.map((item: any) => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>${item.name} x${item.quantity}</span>
                  <span>${formatPrice(item.price * item.quantity)}</span>
                </div>
              `).join('')}
            </div>
            
            ${orderData.deliveryAddress ? `
              <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #333; margin-bottom: 15px;">Teslimat Bilgileri</h3>
                <p><strong>Adres:</strong> ${orderData.deliveryAddress}</p>
                ${orderData.phone ? `<p><strong>Telefon:</strong> ${orderData.phone}</p>` : ''}
              </div>
            ` : ''}
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>Pizza Palace - Lezzetin Adresi</p>
              <p>Bu email otomatik olarak gönderilmiştir.</p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Sipariş onay email'i gönderildi: ${email} -> MessageId: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error('Sipariş email gönderme hatası:', error);
    return false;
  }
}

// Yardımcı fonksiyonlar
function getStatusText(status: string): string {
  switch (status) {
    case 'pending': return 'Onay Bekliyor';
    case 'approved': return 'Hazırlanıyor';
    case 'delivering': return 'Kuryede';
    case 'delivered': return 'Teslim Edildi';
    default: return status;
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(price);
} 