import { PrismaClient } from '@prisma/client';

// DATABASE_URL ayarlama: Kalıcı DB varsa (postgres/mysql/sqlserver/mongodb) asla override etme
(() => {
  const isVercel = !!process.env.VERCEL;
  let url = process.env.DATABASE_URL;
  const hasPersistentDb = typeof url === 'string' && /^(postgres|mysql|sqlserver|mongodb):/i.test(url);

  if (hasPersistentDb) {
    // Kalıcı veritabanı tanımlı → olduğu gibi kullan
    process.env.DATABASE_URL = url;
    return;
  }

  // SQLite durumları
  if (isVercel) {
    // Vercel'de kalıcı dosya sistemi yok. Eğer kullanıcı bilinçli olarak file: verdi ise kullan; yoksa /tmp geçici.
    if (!url) {
      url = 'file:/tmp/pizza.db'; // ephemeral
    }
    // Vercel'de göreli file: yolunu /tmp'ye çevir
    if (url.startsWith('file:./')) {
      url = 'file:/tmp/pizza.db';
    }
  } else {
    // Lokal geliştirme: proje içi kalıcı sqlite dosyası
    if (!url || !url.startsWith('file:')) {
      url = 'file:./databases/pizza.db';
    }
  }

  process.env.DATABASE_URL = url;
})();

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function ensurePrismaSqliteSchema() {
  try {
    // Sadece sqlite için çalıştır
    const isSqlite = (process.env.DATABASE_URL || '').startsWith('file:');
    if (!isSqlite) return;

    // User tablosu
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "phone" TEXT,
        "address" TEXT,
        "emailVerified" INTEGER NOT NULL DEFAULT 0,
        "verificationCode" TEXT,
        "role" TEXT NOT NULL DEFAULT 'user',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME,
        "lastLogin" DATETIME
      );
    `);

    try { await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "lastLogin" DATETIME`); } catch (_) {}

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AppSetting" (
        "key" TEXT PRIMARY KEY,
        "value" TEXT
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        "userId" TEXT,
        "customerName" TEXT NOT NULL,
        "customerEmail" TEXT NOT NULL,
        "customerPhone" TEXT NOT NULL,
        "deliveryAddress" TEXT NOT NULL,
        "totalPrice" REAL NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "customerMessage" TEXT,
        "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
        "paymentMethod" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        "orderId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" REAL NOT NULL,
        FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" REAL NOT NULL,
        "originalPrice" REAL,
        "image" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "rating" REAL,
        "reviewCount" INTEGER,
        "isPremium" INTEGER DEFAULT 0,
        "isVegetarian" INTEGER DEFAULT 0,
        "isSpicy" INTEGER DEFAULT 0,
        "ingredients" TEXT,
        "preparationTime" TEXT,
        "calories" INTEGER,
        "badge" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SupportMessage" (
        "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "message" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'unread',
        "userId" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ChatRoom" (
        "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        "userId" TEXT,
        "adminId" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ChatMessage" (
        "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        "roomId" TEXT NOT NULL,
        "sender" TEXT NOT NULL,
        "text" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
  } catch (e) {
    console.error('ensurePrismaSqliteSchema error:', e);
  }
}

export async function ensureUserLastLoginColumn() {
  try {
    const isSqlite = (process.env.DATABASE_URL || '').startsWith('file:');
    if (!isSqlite) return;
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "lastLogin" DATETIME`);
  } catch (_) {}
}


