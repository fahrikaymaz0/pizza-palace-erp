// API Configuration
const API_CONFIG = {
  // Production'da localhost'a yönlendir
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'http://localhost:3001/api'  // Localhost backend
    : '/api',  // Development'ta local API
  
  // Timeout ayarları
  timeout: 10000,
  
  // Headers
  headers: {
    'Content-Type': 'application/json',
  }
};

export default API_CONFIG; 