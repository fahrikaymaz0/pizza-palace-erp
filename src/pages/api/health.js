export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'OK',
      message: 'API çalışıyor!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      router: 'Pages Router'
    });
  } else if (req.method === 'POST') {
    return res.status(200).json({
      status: 'OK',
      message: 'POST API çalışıyor!',
      receivedData: req.body,
      timestamp: new Date().toISOString(),
      router: 'Pages Router'
    });
  } else {
    return res.status(405).json({
      success: false,
      error: 'GET veya POST metodu kullanın'
    });
  }
} 