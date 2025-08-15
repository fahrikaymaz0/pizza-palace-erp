import { getSupabaseServer } from './supabase';
import { getDatabase } from './sqlite';

type UserRecord = {
  id: number | string;
  email: string;
  name: string;
  role?: string;
  password_hash?: string;
};

type ProductRecord = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  ingredients?: string;
  available?: boolean;
};

type OrderItemInput = { product_id: number; quantity: number; price: number };

type OrderRecord = {
  id: number;
  user_id: number | string;
  total_amount: number;
  status: number;
  created_at?: string;
};

function isProdWithSupabase(): boolean {
  return !!process.env.VERCEL && !!process.env.SUPABASE_URL;
}

export const db = {
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    if (isProdWithSupabase()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, role, password_hash')
        .eq('email', email.toLowerCase())
        .maybeSingle();
      if (error) throw error;
      return data as any;
    }
    const sqlite = getDatabase();
    const row = sqlite
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email.toLowerCase());
    return (row as UserRecord) || null;
  },

  async listMenu(): Promise<ProductRecord[]> {
    if (isProdWithSupabase()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('products')
        .select(
          'id, name, description, price, image, category, ingredients, available'
        )
        .eq('available', true)
        .order('id');
      if (error) throw error;
      return (data || []) as any;
    }
    const sqlite = getDatabase();
    const rows = sqlite
      .prepare('SELECT * FROM products WHERE available = 1')
      .all();
    return rows as any;
  },

  async createOrder(
    userId: number | string,
    items: OrderItemInput[]
  ): Promise<OrderRecord> {
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    if (isProdWithSupabase()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('orders')
        .insert({ user_id: userId, total_amount: total, status: 0 })
        .select('id, user_id, total_amount, status, created_at')
        .single();
      if (error || !data) throw error || new Error('Order oluşturulamadı');
      const orderId = data.id;
      const itemsPayload = items.map(i => ({
        order_id: orderId,
        product_id: i.product_id,
        quantity: i.quantity,
        price: i.price,
      }));
      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(itemsPayload);
      if (itemsErr) throw itemsErr;
      return data as any;
    }
    const sqlite = getDatabase();
    sqlite.prepare('BEGIN').run();
    try {
      const orderStmt = sqlite.prepare(
        'INSERT INTO orders (user_id, total_amount, status, created_at) VALUES (?, ?, 0, ?)'
      );
      const info = orderStmt.run(userId, total, new Date().toISOString());
      const orderId = Number(info.lastInsertRowid);
      const itemStmt = sqlite.prepare(
        'INSERT INTO order_items (order_id, product_id, quantity, price, created_at) VALUES (?, ?, ?, ?, ?)'
      );
      for (const it of items) {
        itemStmt.run(
          orderId,
          it.product_id,
          it.quantity,
          it.price,
          new Date().toISOString()
        );
      }
      sqlite.prepare('COMMIT').run();
      return {
        id: orderId,
        user_id: userId,
        total_amount: total,
        status: 0,
      } as any;
    } catch (e) {
      sqlite.prepare('ROLLBACK').run();
      throw e;
    }
  },
};
