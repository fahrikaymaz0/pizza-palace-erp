const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

// Database dosyasının yolu
const dbPath = path.join(__dirname, 'databases', 'pizza.db');

console.log('🔧 Test kullanıcıları oluşturuluyor...');

try {
  console.log('📁 Çalışma dizini:', __dirname);
  // Database bağlantısı
  const db = new Database(dbPath);
  console.log('✅ Database bağlantısı kuruldu');
  console.log('📁 Database yolu:', dbPath);

  // Users tablosunu kontrol et
  const usersTable = db
    .prepare(
      `
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='users'
  `
    )
    .get();

  console.log('🔍 Users tablosu kontrolü:', usersTable);

  if (!usersTable) {
    console.log('❌ Users tablosu bulunamadı!');
    console.log('📋 Mevcut tablolar:');
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all();
    tables.forEach(table => console.log('  -', table.name));
    process.exit(1);
  }

  // User profiles tablosunu kontrol et
  const profilesTable = db
    .prepare(
      `
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='user_profiles'
  `
    )
    .get();

  if (!profilesTable) {
    console.log('❌ User_profiles tablosu bulunamadı!');
    process.exit(1);
  }

  // Test kullanıcıları
  const testUsers = [
    {
      email: 'test@example.com',
      password: '123456',
      name: 'Test Kullanıcı',
      role: 'user',
    },
    {
      email: 'admin@123',
      password: '123456',
      name: 'Kaymaz Admin',
      role: 'admin',
    },
    {
      email: 'pizzapalaceofficial00@gmail.com',
      password: '123456',
      name: 'Pizza Palace Admin',
      role: 'pizza_admin',
    },
  ];

  // Her test kullanıcısı için
  for (const userData of testUsers) {
    try {
      // Kullanıcı zaten var mı kontrol et
      const existingUser = db
        .prepare('SELECT id FROM users WHERE email = ?')
        .get(userData.email);

      if (existingUser) {
        console.log(`⚠️  Kullanıcı zaten mevcut: ${userData.email}`);
        continue;
      }

      // Şifreyi hashle
      const hashedPassword = bcrypt.hashSync(userData.password, 10);

      // Kullanıcıyı ekle
      const insertUser = db.prepare(`
        INSERT INTO users (email, password_hash, name, role, created_at) 
        VALUES (?, ?, ?, ?, ?)
      `);

      const userResult = insertUser.run(
        userData.email.toLowerCase(),
        hashedPassword,
        userData.name,
        userData.role,
        new Date().toISOString()
      );

      const userId = userResult.lastInsertRowid;

      // Kullanıcı profilini oluştur
      const insertProfile = db.prepare(`
        INSERT INTO user_profiles (user_id, email, email_verified, created_at) 
        VALUES (?, ?, ?, ?)
      `);

      insertProfile.run(
        userId,
        userData.email.toLowerCase(),
        1, // email_verified = true
        new Date().toISOString()
      );

      console.log(
        `✅ Kullanıcı oluşturuldu: ${userData.email} (ID: ${userId})`
      );
    } catch (error) {
      console.error(
        `❌ Kullanıcı oluşturma hatası (${userData.email}):`,
        error.message
      );
    }
  }

  // Kullanıcıları listele
  console.log('\n📋 Mevcut kullanıcılar:');
  const users = db.prepare('SELECT id, email, name, role FROM users').all();

  users.forEach(user => {
    console.log(`  - ${user.email} (${user.name}) - ${user.role}`);
  });

  console.log('\n🎯 Test kullanıcıları hazır!');
  console.log('\n📝 Giriş bilgileri:');
  console.log('  Email: test@example.com, Şifre: 123456');
  console.log('  Email: admin@123, Şifre: 123456');
  console.log('  Email: pizzapalaceofficial00@gmail.com, Şifre: 123456');

  db.close();
  console.log('\n✅ İşlem tamamlandı!');
} catch (error) {
  console.error('❌ Kritik hata:', error.message);
  process.exit(1);
}
