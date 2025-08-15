// Profile API test
async function testProfileAPI() {
  try {
    console.log('🧪 Profile API test başlıyor...');

    // Önce admin login yap
    console.log('1. Admin login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@123',
        password: 'admin123',
      }),
    });

    console.log('Login Status:', loginResponse.status);

    if (loginResponse.ok) {
      // Cookie'yi al
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('🍪 Login cookies:', cookies);

      if (cookies) {
        const authToken = cookies.match(/admin-token=([^;]+)/)?.[1];
        console.log('Token:', authToken?.substring(0, 20) + '...');

        // Profile API'yi test et
        console.log('\n2. Profile API test...');
        const profileResponse = await fetch(
          'http://localhost:3000/api/pizza/profile',
          {
            headers: {
              Cookie: `auth-token=${authToken}`, // auth-token kullan
            },
          }
        );

        console.log('Profile Status:', profileResponse.status);

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('✅ Profile Success:', profileData);
        } else {
          try {
            const errorData = await profileResponse.json();
            console.log('❌ Profile Error:', errorData);
          } catch (e) {
            console.log('❌ Profile Error: HTTP', profileResponse.status);
          }
        }
      }
    } else {
      const loginError = await loginResponse.json();
      console.log('❌ Login failed:', loginError);
    }
  } catch (error) {
    console.error('🚨 Test Error:', error);
  }
}

testProfileAPI();

