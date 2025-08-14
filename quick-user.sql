-- Test user oluşturmak için SQLite komutları
-- Bu komutları SQLite browser ile çalıştır

-- 1. Test user ekle (bcrypt hash for "123456")
INSERT INTO users (email, password_hash, name) 
VALUES ('test@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User');

-- 2. User ID'yi al ve profile oluştur  
INSERT INTO user_profiles (user_id, email, email_verified, phone_verified) 
VALUES (
  (SELECT id FROM users WHERE email = 'test@test.com'), 
  'test@test.com', 
  1, 
  0
);

-- 3. Kontrol et
SELECT u.*, p.email_verified 
FROM users u 
LEFT JOIN user_profiles p ON u.id = p.user_id 
WHERE u.email = 'test@test.com';

