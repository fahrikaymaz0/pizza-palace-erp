const { PizzaDatabase } = require('./src/lib/pizza-database.ts');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    console.log('Test user oluşturuluyor...');

    const db = PizzaDatabase.getInstance();
    await db.init();

    // Test user'ı kontrol et
    const existingUser = await db.getUserByEmail('test@test.com');
    if (existingUser) {
      console.log('Test user zaten mevcut');
      return;
    }

    // Test user oluştur
    const hashedPassword = await bcrypt.hash('123456', 10);
    const success = await db.createUser(
      'test@test.com',
      hashedPassword,
      'Test User'
    );

    if (success) {
      console.log('✅ Test user başarıyla oluşturuldu');

      // Email verified olarak işaretle
      const user = await db.getUserByEmail('test@test.com');
      if (user) {
        await db.updateUserProfileVerificationStatus(
          user.id,
          'email_verified',
          true
        );
        console.log('✅ Email verified olarak işaretlendi');
      }
    } else {
      console.log('❌ Test user oluşturulamadı');
    }
  } catch (error) {
    console.error('Hata:', error);
  }
}

createTestUser();
