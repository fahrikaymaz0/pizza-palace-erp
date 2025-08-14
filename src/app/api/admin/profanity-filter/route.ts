import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import ProfanityFilter from '@/lib/profanityFilter';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Admin yetkisi gerekli' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin yetkisi gerekli' },
        { status: 401 }
      );
    }

    const profanityFilter = ProfanityFilter.getInstance();
    
    const status = {
      totalWords: profanityFilter.getProfanityCount(),
      lastUpdated: new Date().toISOString(),
      isUpToDate: await profanityFilter.isProfanityListUpToDate(),
      source: 'GitHub - ooguz/turkce-kufur-karaliste',
      cacheStatus: await profanityFilter.isProfanityListUpToDate() ? 'Fresh' : 'Stale'
    };

    return NextResponse.json({
      success: true,
      status
    });

  } catch (error) {
    console.error('Profanity filter status error:', error);
    return NextResponse.json(
      { success: false, error: 'Profanity filter durumu alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Admin yetkisi gerekli' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin yetkisi gerekli' },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    const profanityFilter = ProfanityFilter.getInstance();

    if (action === 'refresh') {
      await profanityFilter.refreshProfanityList();
      
      return NextResponse.json({
        success: true,
        message: 'Profanity listesi başarıyla güncellendi',
        totalWords: profanityFilter.getProfanityCount()
      });
    }

    if (action === 'getWords') {
      const words = profanityFilter.getProfanityWords();
      
      return NextResponse.json({
        success: true,
        words: words.slice(0, 100), // İlk 100 kelimeyi göster
        totalWords: words.length
      });
    }

    return NextResponse.json(
      { success: false, error: 'Geçersiz işlem' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Profanity filter action error:', error);
    return NextResponse.json(
      { success: false, error: 'Profanity filter işlemi başarısız' },
      { status: 500 }
    );
  }
} 