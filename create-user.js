const { PizzaDatabase } = require('./src/lib/pizza-database');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    console.log('🔧 Test user oluşturuluyor...');
    
    const db = PizzaDatabase.getInstance();
    await db.init();
    
    // Test user'ı kontrol et
    const existingUser = await db.getUserByEmail('test@test.com');
    if (existingUser) {
      console.log('✅ Test user zaten mevcut:', existingUser.email);
      
      // Email verified durumunu kontrol et
      const profile = await db.getUserProfile(existingUser.id);
      console.log('Email verified:', profile?.email_verified);
      
      if (!profile?.email_verified) {
        console.log('📧 Email verified olarak işaretleniyor...');
        await db.updateUserProfileVerificationStatus(existingUser.id, 'email_verified', true);
        console.log('✅ Email verified güncellendi');
      }
      
      return;
    }
    
    // Test user oluştur
    console.log('👤 Yeni test user oluşturuluyor...');
    const success = await db.createUser('test@test.com', '123456', 'Test User');
    
    if (success) {
      console.log('✅ Test user başarıyla oluşturuldu');
      
      // Email verified olarak işaretle
      const user = await db.getUserByEmail('test@test.com');
      if (user) {
        await db.updateUserProfileVerificationStatus(user.id, 'email_verified', true);
        console.log('✅ Email verified olarak işaretlendi');
        console.log('📋 User:', { id: user.id, email: user.email, name: user.name });
      }
    } else {
      console.log('❌ Test user oluşturulamadı');
    }
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

createTestUser();
