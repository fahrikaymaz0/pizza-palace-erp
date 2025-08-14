import { NextResponse } from 'next/server';
import pizzaDb from '@/lib/pizza-database';

export async function GET(
  request: Request,
  { params }: { params: { clientId: string; tableName: string } }
) {
  try {
    await pizzaDb.init();
    
    const schema = await pizzaDb.getTableSchema(params.clientId, params.tableName);
    
    if (schema.length === 0) {
      return NextResponse.json({ 
        error: 'Tablo şeması bulunamadı' 
      }, { status: 404 });
    }
    
    return NextResponse.json(schema);
    
  } catch (error) {
    console.error('Table schema get error:', error);
    return NextResponse.json({ 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
} 