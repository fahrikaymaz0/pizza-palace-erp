import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/sqlite';

export async function POST(request: NextRequest) {
  try {
    const { cardNumber } = await request.json();
    
    if (!cardNumber || cardNumber.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz kart numarası' 
      }, { status: 400 });
    }

    const bin = parseInt(cardNumber.substring(0, 6));
    const database = getDatabase();
    
    const binInfo = database.prepare('SELECT * FROM binlist WHERE bin = ?').get(bin) as any;
    
    if (!binInfo) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bilinmeyen kart türü' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        bank: binInfo.banka_adi,
        type: binInfo.type,
        subType: binInfo.sub_type,
        virtual: binInfo.virtual === 'virtual',
        prepaid: binInfo.prepaid === 'PREPAID'
      }
    });

  } catch (error) {
    console.error('BIN verification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'BIN doğrulama hatası' 
    }, { status: 500 });
  }
}





