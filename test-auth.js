// Auth Test Tool
console.log('🔧 Auth Test Tool Başlatılıyor...');

async function testLoginFlow() {
  try {
    console.log('\n1️⃣ Normal User Login Test...');
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: '123456'
      }),
    });
    
    console.log('Login Response Status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login Success:', loginData);
      
      // Cookie'leri al
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('🍪 Cookies:', cookies);
      
      // Auth verify test
      console.log('\n2️⃣ Auth Verify Test...');
      
      // Cookie'yi parse et
      const authToken = cookies?.match(/auth-token=([^;]+)/)?.[1];
      console.log('Token:', authToken?.substring(0, 20) + '...');
      
      const verifyResponse = await fetch('http://localhost:3000/api/auth/verify', {
        headers: {
          'Cookie': `auth-token=${authToken}`
        }
      });
      
      console.log('Verify Response Status:', verifyResponse.status);
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log('✅ Verify Success:', verifyData);
      } else {
        const verifyError = await verifyResponse.json();
        console.log('❌ Verify Error:', verifyError);
      }
      
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login Error:', errorData);
    }
    
  } catch (error) {
    console.error('🚨 Test Error:', error);
  }
}

testLoginFlow();
