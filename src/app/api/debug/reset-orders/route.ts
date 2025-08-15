import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/sqlite';

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Sipariş status'ları sıfırlanıyor...");

    const database = getDatabase();

    // Tüm siparişlerin status'unu 0'a sıfırla
    const result = database
      .prepare(
        `
      UPDATE orders SET status = 0
    `
      )
      .run();

    console.log(`✅ ${result.changes} sipariş status'u sıfırlandı`);

    return NextResponse.json({
      success: true,
      message: `${result.changes} sipariş status'u sıfırlandı`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Sipariş status sıfırlama hatası:', error);
    return NextResponse.json(
      { error: "Sipariş status'ları sıfırlanamadı" },
      { status: 500 }
    );
  }
}

