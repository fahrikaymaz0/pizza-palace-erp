import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Modern Pizza ERP System çalışıyor!',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  })
} 