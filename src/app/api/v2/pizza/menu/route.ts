import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const items = await db.listMenu();
    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    console.error('v2 menu error', e);
    return NextResponse.json(
      { success: false, error: 'Menü alınamadı' },
      { status: 500 }
    );
  }
}
