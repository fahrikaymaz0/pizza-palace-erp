// Direct user creation for testing
const bcrypt = require('bcryptjs');

// Simulate email verification by directly creating user
async function createDirectUser() {
  try {
    console.log('🧪 Direct user creation test...');
    
    const testEmail = 'test@test.com';
    const testPassword = '123456';
    const testName = 'Test User';
    
    // Hash the password properly
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    console.log('🔐 Password hash created:', hashedPassword.substring(0, 20) + '...');
    
    // Simulate API call to verify-email (which creates the user)
    const verifyEmailResponse = await fetch('http://localhost:3000/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        code: '123456' // This will fail but we want to test the user creation logic
      }),
    });
    
    console.log('Verify Email Status:', verifyEmailResponse.status);
    const verifyData = await verifyEmailResponse.json();
    console.log('Verify Response:', verifyData);
    
    // Now test login with our known credentials
    console.log('\n🔐 Testing login...');
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      }),
    });
    
    console.log('Login Status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login Response:', loginData);
    
  } catch (error) {
    console.error('🚨 Test Error:', error);
  }
}

createDirectUser();









