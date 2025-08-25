import { PrismaClient } from '@prisma/client';

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
        "id" TEXT PRIMARY KEY,
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
        "updatedAt" DATETIME
      );
    `);

    // Order tablosu
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT PRIMARY KEY,
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

    // OrderItem tablosu
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        "id" TEXT PRIMARY KEY,
        "orderId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" REAL NOT NULL,
        FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    // SupportMessage tablosu
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SupportMessage" (
        "id" TEXT PRIMARY KEY,
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

    // ChatRoom tablosu
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ChatRoom" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT,
        "adminId" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    // ChatMessage tablosu
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ChatMessage" (
        "id" TEXT PRIMARY KEY,
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


