import { kv } from '@vercel/kv';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  password_hash: string;
}

export class VercelKVService {
  // Kullanıcı oluştur
  static async createUser(user: User): Promise<void> {
    await kv.set(`user:${user.email}`, user);
    await kv.set(`user:${user.id}`, user);
  }

  // Email ile kullanıcı bul
  static async getUserByEmail(email: string): Promise<User | null> {
    const user = await kv.get<User>(`user:${email.toLowerCase()}`);
    return user || null;
  }

  // ID ile kullanıcı bul
  static async getUserById(id: string): Promise<User | null> {
    const user = await kv.get<User>(`user:${id}`);
    return user || null;
  }

  // Tüm kullanıcıları getir
  static async getAllUsers(): Promise<User[]> {
    const keys = await kv.keys('user:*');
    const users: User[] = [];
    
    for (const key of keys) {
      const user = await kv.get<User>(key);
      if (user) {
        users.push(user);
      }
    }
    
    return users;
  }

  // Kullanıcı güncelle
  static async updateUser(email: string, updates: Partial<User>): Promise<void> {
    const user = await this.getUserByEmail(email);
    if (user) {
      const updatedUser = { ...user, ...updates };
      await kv.set(`user:${email.toLowerCase()}`, updatedUser);
      await kv.set(`user:${user.id}`, updatedUser);
    }
  }

  // Kullanıcı sil
  static async deleteUser(email: string): Promise<void> {
    const user = await this.getUserByEmail(email);
    if (user) {
      await kv.del(`user:${email.toLowerCase()}`);
      await kv.del(`user:${user.id}`);
    }
  }
} 