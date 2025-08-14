import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { getDatabase } from '@/lib/sqlite';

export async function GET() {
  try {
    const database = getDatabase();
          const result = database.prepare('SELECT 1 as ok').get();
      return NextResponse.json({ success: true, db: 'ok', result });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}


