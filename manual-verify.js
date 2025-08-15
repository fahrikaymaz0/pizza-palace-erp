// Manual verification test
async function manualVerifyTest() {
  try {
    const testEmail = 'test@example.com';

    console.log('📧 1. Register call...');

    // 1. Register
    const registerResponse = await fetch(
      'http://localhost:3000/api/auth/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: '123456',
          name: 'Test User',
        }),
      }
    );

    const registerData = await registerResponse.json();
    console.log('Register Response:', registerData);

    if (registerResponse.ok) {
      // 2. Fake verification with a simple code (since we can't get real email)
      console.log('\n✉️ 2. Manual verification with fake code...');

      const verifyResponse = await fetch(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testEmail,
            code: '999999', // Fake code - this will fail but show us the flow
          }),
        }
      );

      const verifyData = await verifyResponse.json();
      console.log('Verify Status:', verifyResponse.status);
      console.log('Verify Response:', verifyData);

      // 3. Try login anyway
      console.log('\n🔐 3. Login attempt...');

      const loginResponse = await fetch(
        'http://localhost:3000/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testEmail,
            password: '123456',
          }),
        }
      );

      const loginData = await loginResponse.json();
      console.log('Login Status:', loginResponse.status);
      console.log('Login Response:', loginData);
    }
  } catch (error) {
    console.error('🚨 Manual test error:', error);
  }
}

manualVerifyTest();

