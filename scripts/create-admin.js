const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Admin kullanıcısı var mı kontrol et
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@pizzakralligi.com' }
    });

    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut!');
      return;
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Admin kullanıcısını oluştur
    const admin = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'Root',
        email: 'admin@pizzakralligi.com',
        password: hashedPassword,
        emailVerified: true,
        phone: '05551234567',
        role: 'admin'
      }
    });

    console.log('✅ Admin kullanıcısı başarıyla oluşturuldu!');
    console.log('📧 E-posta: admin@pizzakralligi.com');
    console.log('🔑 Şifre: admin123');
    console.log('🆔 Kullanıcı ID:', admin.id);

  } catch (error) {
    console.error('❌ Admin oluşturma hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

