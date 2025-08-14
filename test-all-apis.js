// Admin Panel'deki tüm API'leri test et
console.log('🧪 Admin Panel API Test Script');

const apiChecks = [
  // Pizza Palace API'leri - Authentication
  {
    name: 'Login API',
    url: '/api/auth/login',
    method: 'POST',
    requiresAuth: false,
    body: { email: 'admin@123', password: 'admin123' },
  },
  {
    name: 'Register API',
    url: '/api/auth/register',
    method: 'POST',
    requiresAuth: false,
    body: { name: 'Test User', email: 'test@test.com', password: '123456' },
  },
  {
    name: 'Logout API',
    url: '/api/auth/logout',
    method: 'POST',
    requiresAuth: true,
    body: null,
  },
  {
    name: 'Verify Token API',
    url: '/api/auth/verify',
    method: 'GET',
    requiresAuth: true,
    body: null,
  },
  {
    name: 'Verify Email API',
    url: '/api/auth/verify-email',
    method: 'POST',
    requiresAuth: false,
    body: { email: 'test@test.com', code: '123456' },
  },
  {
    name: 'Forgot Password API',
    url: '/api/auth/forgot-password',
    method: 'POST',
    requiresAuth: false,
    body: { email: 'test@test.com' },
  },
  {
    name: 'Reset Password API',
    url: '/api/auth/reset-password',
    method: 'POST',
    requiresAuth: false,
    body: { email: 'test@test.com', code: '123456', newPassword: 'newpass123' },
  },

  // Pizza Palace API'leri - Pizza Operations
  {
    name: 'Pizza Menu API',
    url: '/api/pizza/menu',
    method: 'GET',
    requiresAuth: false,
    body: null,
  },
  {
    name: 'Pizza Orders API',
    url: '/api/pizza/orders',
    method: 'GET',
    requiresAuth: true,
    body: null,
  },
  {
    name: 'Pizza Orders Create API',
    url: '/api/pizza/orders',
    method: 'POST',
    requiresAuth: true,
    body: { items: [{ name: 'Test Pizza', price: 50, quantity: 1 }] },
  },
  {
    name: 'Pizza Profile API',
    url: '/api/pizza/profile',
    method: 'GET',
    requiresAuth: true,
    body: null,
  },
  {
    name: 'Pizza Reviews API',
    url: '/api/pizza/reviews',
    method: 'GET',
    requiresAuth: false,
    body: null,
  },
  {
    name: 'Pizza Reviews Create API',
    url: '/api/pizza/reviews',
    method: 'POST',
    requiresAuth: true,
    body: { rating: 5, comment: 'Test review' },
  },
  {
    name: 'Pizza Campaigns API',
    url: '/api/pizza/campaigns',
    method: 'GET',
    requiresAuth: true,
    body: null,
  },
];

async function testAllAPIs() {
  console.log(`\n🎯 ${apiChecks.length} API test ediliyor...\n`);

  for (let i = 0; i < apiChecks.length; i++) {
    const api = apiChecks[i];

    try {
      console.log(`${i + 1}. ${api.name} test ediliyor...`);

      const requestOptions = {
        method: api.method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (api.method === 'POST' && api.body) {
        requestOptions.body = JSON.stringify(api.body);
      }

      const startTime = Date.now();
      const response = await fetch(
        `http://localhost:3000${api.url}`,
        requestOptions
      );
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Auth gerektiren API'ler için 401 normal
      // Email verify, forgot password, reset password için 400 da normal (test data)
      const isTestAPI =
        api.name.includes('Verify Email') ||
        api.name.includes('Forgot Password') ||
        api.name.includes('Reset Password');
      const isWorking = api.requiresAuth
        ? response.status === 401 || response.ok
        : isTestAPI
          ? response.status === 400 || response.ok
          : response.ok;

      const status = isWorking ? '✅ OK' : '❌ ERROR';
      console.log(`   ${status} [${response.status}] ${responseTime}ms`);

      if (!isWorking && !api.requiresAuth) {
        try {
          const errorData = await response.json();
          console.log(
            `   Error: ${errorData.error || errorData.message || 'Unknown error'}`
          );
        } catch (e) {
          console.log(`   Error: HTTP ${response.status}`);
        }
      }
    } catch (error) {
      console.log(`   ❌ NETWORK ERROR: ${error.message}`);
    }

    console.log(''); // Boş satır
  }

  console.log('🎉 Tüm API testleri tamamlandı!');
}

testAllAPIs();
