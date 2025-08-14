import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/sqlite';
import { ProfanityFilter } from '@/lib/profanityFilter';
import { 
  createErrorResponse, 
  ERROR_CODES, 
  generateRequestId 
} from '@/lib/apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`⭐ [${requestId}] Reviews API GET başladı`);
  
  try {
    const database = getDatabase();

    // Tüm yorumları getir
    const reviewsResult = database.prepare(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      ORDER BY r.created_at DESC
    `).all();

    const reviews = reviewsResult.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      userName: review.user_name,
      createdAt: review.created_at
    }));

    console.log(`✅ [${requestId}] ${reviews.length} yorum getirildi`);
    
    return NextResponse.json({
      success: true,
      message: 'Yorumlar başarıyla getirildi',
      data: { reviews },
      requestId,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error(`❌ [${requestId}] Reviews GET error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Yorumlar alınamadı',
        code: 'INTERNAL_SERVER_ERROR',
        requestId 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`⭐ [${requestId}] Reviews API POST başladı`);
  
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Giriş yapmış olmanız gerekiyor',
          code: 'TOKEN_INVALID',
          requestId 
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const body = await request.json();
    const { rating, comment } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçerli bir puan giriniz (1-5)',
          code: 'VALIDATION_ERROR',
          requestId 
        },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Yorum en az 10 karakter olmalıdır',
          code: 'VALIDATION_ERROR',
          requestId 
        },
        { status: 400 }
      );
    }

    // Profanity filter
    const profanityFilter = ProfanityFilter.getInstance();
    const profanityCount = profanityFilter.getProfanityCount(comment);
    
    if (profanityCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Yorumunuzda uygunsuz içerik bulunmaktadır',
          code: 'PROFANITY_DETECTED',
          requestId 
        },
        { status: 400 }
      );
    }

    const database = getDatabase();

    // Kullanıcının daha önce yorum yapıp yapmadığını kontrol et
    const existingReview = database.prepare('SELECT id FROM reviews WHERE user_id = ?').get(decoded.userId);

    if (existingReview) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Daha önce yorum yapmışsınız',
          code: 'DUPLICATE_REVIEW',
          requestId 
        },
        { status: 400 }
      );
    }

    // Yeni yorum ekle
    database.prepare(`
      INSERT INTO reviews (user_id, rating, comment, created_at) 
      VALUES (?, ?, ?, ?)
    `).run(decoded.userId, rating, comment.trim(), new Date().toISOString());

    console.log(`✅ [${requestId}] Yorum başarıyla eklendi`);
    
    return NextResponse.json({
      success: true,
      message: 'Yorumunuz başarıyla eklendi',
      data: { rating, comment: comment.trim() },
      requestId,
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error(`❌ [${requestId}] Reviews POST error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Yorum eklenemedi',
        code: 'INTERNAL_SERVER_ERROR',
        requestId 
      },
      { status: 500 }
    );
  }
} 