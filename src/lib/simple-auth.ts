import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'pizza-palace-secret-2024';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  password_hash: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResult {
  success: boolean;
  user?: UserResponse;
  token?: string;
  error?: string;
}

// Basit in-memory kullanıcı sistemi
const USERS: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    password_hash: '$2a$10$rQZ8K9L2M1N0P9Q8R7S6T5U4V3W2X1Y0Z',
    name: 'Test Kullanıcı',
    role: 'user'
  },
  {
    id: '2',
    email: 'admin@123',
    password_hash: '$2a$10$rQZ8K9L2M1N0P9Q8R7S6T5U4V3W2X1Y0Z',
    name: 'Admin',
    role: 'admin'
  },
  {
    id: '3',
    email: 'pizzapalaceofficial00@gmail.com',
    password_hash: '$2a$10$rQZ8K9L2M1N0P9Q8R7S6T5U4V3W2X1Y0Z',
    name: 'Pizza Admin',
    role: 'pizza_admin'
  }
];

export class SimpleAuthService {
  // Kullanıcı girişi
  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        return { success: false, error: 'Email veya şifre hatalı' };
      }

      // Basit şifre kontrolü (123456 için)
      const isValidPassword = password === '123456' || await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return { success: false, error: 'Email veya şifre hatalı' };
      }

      // JWT token oluştur
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Giriş hatası' };
    }
  }

  // Kullanıcı kaydı
  static async register(name: string, email: string, password: string): Promise<AuthResult> {
    try {
      // Email kontrolü
      const existingUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return { success: false, error: 'Bu email adresi zaten kullanımda' };
      }

      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(password, 10);

      // Yeni kullanıcı oluştur
      const newUser: User = {
        id: (USERS.length + 1).toString(),
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        name: name.trim(),
        role: 'user'
      };

      // Kullanıcıyı listeye ekle
      USERS.push(newUser);

      // JWT token oluştur
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        },
        token
      };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Kayıt hatası' };
    }
  }

  // Token doğrulama
  static async verifyToken(token: string): Promise<AuthResult> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = USERS.find(u => u.id === decoded.userId);
      
      if (!user) {
        return { success: false, error: 'Kullanıcı bulunamadı' };
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      return { success: false, error: 'Geçersiz token' };
    }
  }

  // Tüm kullanıcıları getir (admin için)
  static async getAllUsers(): Promise<UserResponse[]> {
    return USERS.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }));
  }
} 