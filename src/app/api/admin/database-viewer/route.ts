import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/sqlite';

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

    const database = getDatabase();
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Eğer belirli bir tablo isteniyorsa
    if (table) {
      try {
        const countResult = database.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
        const dataResult = database.prepare(`SELECT * FROM ${table} LIMIT ? OFFSET ?`).all(limit, offset);
        
        return NextResponse.json({
          success: true,
          table,
          data: dataResult,
          totalCount: countResult.count,
          limit,
          offset
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: `Tablo '${table}' bulunamadı veya erişilemedi` },
          { status: 400 }
        );
      }
    }

    // Genel veritabanı istatistikleri
    const stats = getDatabaseStats();
    const dbSize = getDatabaseSize();

    // Tüm tabloları listele
    const tablesResult = database.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `).all();

    const tables = tablesResult.map((row: any) => row.name);

    return NextResponse.json({
      success: true,
      database: {
        size: dbSize,
        sizeFormatted: formatBytes(dbSize),
        tables: tables.length,
        stats
      },
      tables: tables.map(tableName => ({
        name: tableName,
        count: (database.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get() as { count: number }).count
      }))
    });

  } catch (error) {
    console.error('Database viewer error:', error);
    return NextResponse.json(
      { success: false, error: 'Veritabanı bilgileri alınamadı' },
      { status: 500 }
    );
  }
}

// Dosya boyutunu formatla
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Veritabanı istatistiklerini al
function getDatabaseStats() {
  try {
    const database = getDatabase();
    const tablesResult = database.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();
    
    const stats: any = {};
    tablesResult.forEach((row: any) => {
      const countResult = database.prepare(`SELECT COUNT(*) as count FROM ${row.name}`).get() as { count: number };
      stats[row.name] = countResult.count;
    });
    
    return stats;
  } catch (error) {
    console.error('Database stats error:', error);
    return {};
  }
}

// Veritabanı boyutunu al
function getDatabaseSize(): number {
  try {
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'pizza-palace.db');
    
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      return stats.size;
    }
    return 0;
  } catch (error) {
    console.error('Database size error:', error);
    return 0;
  }
}





