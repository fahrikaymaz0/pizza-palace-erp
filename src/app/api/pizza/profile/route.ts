import { NextRequest, NextResponse } from 'next/server';
import { generateRequestId } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`👤 [${requestId}] Profile API GET başladı`);
  
  try {
    return NextResponse.json({
      success: true,
      message: 'Profil bilgileri başarıyla getirildi',
      data: { 
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          email_verified: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          total_orders: 0,
          total_spent: 0
        }
      },
      requestId,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error(`❌ [${requestId}] Profile GET error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Profil bilgileri alınamadı',
        code: 'INTERNAL_SERVER_ERROR',
        requestId 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`👤 [${requestId}] Profile API PUT başladı`);
  
  try {
    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      requestId,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error(`❌ [${requestId}] Profile PUT error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Profil güncellenemedi',
        code: 'INTERNAL_SERVER_ERROR',
        requestId 
      },
      { status: 500 }
    );
  }
} 