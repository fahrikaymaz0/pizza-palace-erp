const nodemailer = require('nodemailer');

// 6 haneli doğrulama kodu oluştur
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email transporter oluştur
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

// Email gönderme fonksiyonu
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: to,
      subject: subject,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email gönderme hatası:', error);
    return { success: false, error: error.message };
  }
};

// Doğrulama kodu email'i
const sendVerificationEmail = async (email, code) => {
  const subject = 'Email Doğrulama Kodu';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Email Doğrulama</h2>
      <p>Doğrulama kodunuz: <strong style="font-size: 24px; color: #007bff;">${code}</strong></p>
      <p>Bu kod 10 dakika geçerlidir.</p>
    </div>
  `;

  return await sendEmail(email, subject, html);
};

// Şifre sıfırlama email'i
const sendPasswordResetEmail = async (email, resetLink) => {
  const subject = 'Şifre Sıfırlama';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Şifre Sıfırlama</h2>
      <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
      <a href="${resetLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Şifremi Sıfırla</a>
      <p>Bu link 1 saat geçerlidir.</p>
    </div>
  `;

  return await sendEmail(email, subject, html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  generateVerificationCode,
};
