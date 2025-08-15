import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const auth = request.cookies.get('auth-token')?.value || '';
    if (!auth)
      return NextResponse.json(
        { success: false, error: 'Yetkisiz' },
        { status: 401 }
      );
    let decoded: any;
    try {
      decoded = jwt.verify(auth, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      );
    }
    const { items } = await request.json();
    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json(
        { success: false, error: 'Geçersiz sepet' },
        { status: 400 }
      );
    const order = await db.createOrder(decoded.userId, items);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (e) {
    console.error('v2 order create error', e);
    return NextResponse.json(
      { success: false, error: 'Sipariş oluşturulamadı' },
      { status: 500 }
    );
  }
}
