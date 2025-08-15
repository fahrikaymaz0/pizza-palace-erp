/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pages Router kullanıyoruz
  experimental: {
    appDir: false
  },
  
  // Cache busting
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  
  // API routes için cache'i devre dışı bırak
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
