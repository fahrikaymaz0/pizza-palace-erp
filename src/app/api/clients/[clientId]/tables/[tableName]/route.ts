import { NextRequest, NextResponse } from 'next/server';
import { dbManager } from '@/lib/database';

// GET /api/clients/[clientId]/tables/[tableName] - Tablo şemasını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string; tableName: string } }
) {
  try {
    const { clientId, tableName } = params;
    
    // Müşterinin var olup olmadığını kontrol et
    const client = await dbManager.getClient(clientId);
    if (!client) {
      return NextResponse.json({
        success: false,
        error: 'Müşteri bulunamadı'
      }, { status: 404 });
    }

    const schema = await dbManager.getTableSchema(clientId, tableName);
    
    if (schema.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Tablo bulunamadı'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        tableName,
        columns: schema
      },
      message: 'Tablo şeması başarıyla getirildi'
    });

  } catch (error) {
    console.error('Tablo şeması getirilirken hata:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Tablo şeması getirilemedi',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 