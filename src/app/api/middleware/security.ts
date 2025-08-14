import { NextRequest, NextResponse } from 'next/server';

export async function securityMiddleware(request: NextRequest) {
  // Basit güvenlik kontrolleri
  const userAgent = request.headers.get('user-agent');
  const contentType = request.headers.get('content-type');

  // Bot kontrolü
  if (
    userAgent &&
    (userAgent.includes('bot') ||
      userAgent.includes('crawler') ||
      userAgent.includes('spider'))
  ) {
    return NextResponse.json(
      { success: false, error: 'Bot erişimi engellendi' },
      { status: 403 }
    );
  }

  // Content-Type kontrolü (POST istekleri için)
  if (request.method === 'POST' && contentType !== 'application/json') {
    return NextResponse.json(
      { success: false, error: 'Geçersiz Content-Type' },
      { status: 400 }
    );
  }

  return null; // Devam et
}
