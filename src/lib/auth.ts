import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

export interface AdminUser {
  username: string;
  role: string;
  timestamp: number;
}

// Token doğrula
export function verifyToken(request: NextRequest): AdminUser | null {
  try {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    
    // Token süresi kontrolü
    const now = Date.now();
    const tokenAge = now - decoded.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 saat

    if (tokenAge > maxAge) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    return null;
  }
}

// Admin yetkisi kontrolü
export function isAdmin(user: AdminUser | null): boolean {
  return user?.role === 'admin' && user?.username === 'admin';
}

// Güvenli şifre hash'i oluştur
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.hash(password, 12);
} 