import { NextRequest, NextResponse } from 'next/server';

// Base64 yardımcı fonksiyonları
class Base64Utils {
  static getBase64Size(base64: string): number {
    const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
    const sizeInBytes = (base64.length * 3) / 4 - padding;
    return sizeInBytes / (1024 * 1024); // MB cinsinden
  }

  static validateFileSize(base64: string, maxSizeMB: number = 10): boolean {
    const size = this.getBase64Size(base64);
    return size <= maxSizeMB;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base64, filename, mimeType, category = 'general' } = body;

    // Validasyon
    if (!base64 || !filename || !mimeType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Base64, filename ve mimeType gerekli',
        },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et
    if (!Base64Utils.validateFileSize(base64, 10)) {
      return NextResponse.json(
        {
          success: false,
          error: "Dosya boyutu 10MB'dan büyük olamaz",
        },
        { status: 400 }
      );
    }

    // Dosya türünü kontrol et
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/webm',
      'application/pdf',
    ];

    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Desteklenmeyen dosya türü',
        },
        { status: 400 }
      );
    }

    // Dosya boyutunu hesapla
    const fileSize = Base64Utils.getBase64Size(base64);

    // Benzersiz ID oluştur
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileExtension = filename.split('.').pop();
    const newFilename = `${fileId}.${fileExtension}`;

    // Dosya bilgilerini döndür
    const fileInfo = {
      id: fileId,
      filename: newFilename,
      originalName: filename,
      mimeType,
      size: fileSize,
      category,
      base64: base64, // Gerçek uygulamada bu veritabanına kaydedilir
      uploadedAt: new Date().toISOString(),
    };

    // TODO: Veritabanına kaydet
    // Bu örnekte sadece dosya bilgilerini döndürüyoruz
    // Gerçek uygulamada base64'ü veritabanına kaydetmek gerekir

    return NextResponse.json(
      {
        success: true,
        message: 'Dosya başarıyla yüklendi',
        data: fileInfo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Base64 yükleme hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Dosya yüklenirken hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');
    const category = searchParams.get('category');

    // TODO: Veritabanından dosya bilgilerini al
    // Bu örnekte boş liste döndürüyoruz

    return NextResponse.json(
      {
        success: true,
        data: [],
        message: 'Dosya listesi alındı',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dosya listesi alma hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Dosya listesi alınamadı',
      },
      { status: 500 }
    );
  }
}
