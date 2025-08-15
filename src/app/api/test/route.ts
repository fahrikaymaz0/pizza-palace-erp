import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const timestamp = Date.now();
  
  return NextResponse.json({
    success: true,
    message: 'API çalışıyor!',
    timestamp: new Date().toISOString(),
    buildId: timestamp,
    environment: process.env.NODE_ENV,
    jwt_secret: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
    cache_busting: true
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const timestamp = Date.now();
  
  return NextResponse.json({
    success: true,
    message: 'POST API çalışıyor!',
    receivedData: body,
    timestamp: new Date().toISOString(),
    buildId: timestamp,
    cache_busting: true
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
} 