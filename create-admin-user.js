// Create admin user for testing
async function createAdminUser() {
  try {
    console.log('👨‍💼 Admin user test...');

    // Test admin login
    const adminLoginResponse = await fetch(
      'http://localhost:3000/api/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@123',
          password: 'admin123',
        }),
      }
    );

    console.log('Admin Login Status:', adminLoginResponse.status);
    const adminData = await adminLoginResponse.json();
    console.log('Admin Login Response:', adminData);

    if (adminLoginResponse.ok) {
      console.log('✅ Admin login başarılı!');

      // Cookie test
      const cookies = adminLoginResponse.headers.get('set-cookie');
      if (cookies) {
        const authToken = cookies.match(/admin-token=([^;]+)/)?.[1];
        console.log('🍪 Admin token alındı:', authToken ? 'var' : 'yok');
      }
    } else {
      console.log('❌ Admin login başarısız!');
    }
  } catch (error) {
    console.error('🚨 Admin test error:', error);
  }
}

createAdminUser();
