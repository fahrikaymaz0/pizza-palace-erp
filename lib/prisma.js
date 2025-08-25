import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Database URL'yi kontrol et ve ayarla
const getDatabaseUrl = () => {
  // Eğer DATABASE_URL zaten ayarlanmışsa kullan
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Vercel'de Postgres varsa kullan
  if (process.env.POSTGRES_URL) {
    return process.env.POSTGRES_URL;
  }
  
  // Fallback olarak SQLite kullan
  return 'file:/tmp/pizza.db';
};

// Prisma client'ı yeniden oluştur
const createPrismaClient = () => {
  const databaseUrl = getDatabaseUrl();
  
  // Eğer URL değiştiyse yeni client oluştur
  if (prisma._databaseUrl !== databaseUrl) {
    if (prisma) {
      prisma.$disconnect();
    }
    
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    });
    prisma._databaseUrl = databaseUrl;
  }
  
  return prisma;
};

// Schema'yı kontrol et ve gerekirse oluştur
export const ensurePrismaSchema = async () => {
  try {
    const client = createPrismaClient();
    
    // User tablosunu kontrol et
    await client.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "firstName" TEXT,
        "lastName" TEXT,
        "phone" TEXT,
        "address" TEXT,
        "role" TEXT DEFAULT 'user',
        "isVerified" BOOLEAN DEFAULT false,
        "verificationCode" TEXT,
        "verificationExpires" DATETIME,
        "lastLogin" DATETIME,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )
    `;

    // AppSetting tablosunu kontrol et
    await client.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AppSetting" (
        "id" TEXT NOT NULL,
        "key" TEXT NOT NULL UNIQUE,
        "value" TEXT,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )
    `;

    // Product tablosunu kontrol et
    await client.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" REAL NOT NULL,
        "originalPrice" REAL,
        "image" TEXT,
        "category" TEXT,
        "rating" REAL DEFAULT 0,
        "reviewCount" INTEGER DEFAULT 0,
        "isPremium" BOOLEAN DEFAULT false,
        "isVegetarian" BOOLEAN DEFAULT false,
        "isSpicy" BOOLEAN DEFAULT false,
        "ingredients" TEXT,
        "preparationTime" TEXT,
        "calories" INTEGER,
        "badge" TEXT,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )
    `;

    // Order tablosunu kontrol et
    await client.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "items" TEXT NOT NULL,
        "totalAmount" REAL NOT NULL,
        "status" TEXT DEFAULT 'pending',
        "paymentStatus" TEXT DEFAULT 'pending',
        "paymentMethod" TEXT DEFAULT 'cash',
        "address" TEXT,
        "phone" TEXT,
        "notes" TEXT,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )
    `;

    // ChatRoom tablosunu kontrol et
    await client.$executeRaw`
      CREATE TABLE IF NOT EXISTS "ChatRoom" (
        "id" TEXT NOT NULL,
        "userId" TEXT,
        "adminId" TEXT,
        "status" TEXT DEFAULT 'active',
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )
    `;

    // ChatMessage tablosunu kontrol et
    await client.$executeRaw`
      CREATE TABLE IF NOT EXISTS "ChatMessage" (
        "id" TEXT NOT NULL,
        "roomId" TEXT NOT NULL,
        "senderId" TEXT NOT NULL,
        "senderType" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "isRead" BOOLEAN DEFAULT false,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )
    `;

    console.log('Database schema checked and updated');
  } catch (error) {
    console.error('Schema check error:', error);
    throw error;
  }
};

// User tablosunda lastLogin kolonunu kontrol et
export const ensureUserLastLoginColumn = async () => {
  try {
    const client = createPrismaClient();
    
    // SQLite için kolon kontrolü
    const columns = await client.$queryRaw`
      PRAGMA table_info("User")
    `;
    
    const hasLastLogin = columns.some(col => col.name === 'lastLogin');
    
    if (!hasLastLogin) {
      await client.$executeRaw`
        ALTER TABLE "User" ADD COLUMN "lastLogin" DATETIME
      `;
      console.log('Added lastLogin column to User table');
    }
  } catch (error) {
    console.error('LastLogin column check error:', error);
  }
};

// AppSetting tablosunu kontrol et
export const ensureAppSettingTable = async () => {
  try {
    const client = createPrismaClient();
    
    const tables = await client.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' AND name='AppSetting'
    `;
    
    if (tables.length === 0) {
      await client.$executeRaw`
        CREATE TABLE "AppSetting" (
          "id" TEXT NOT NULL,
          "key" TEXT NOT NULL UNIQUE,
          "value" TEXT,
          "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY ("id")
        )
      `;
      console.log('Created AppSetting table');
    }
  } catch (error) {
    console.error('AppSetting table check error:', error);
  }
};

// Eski fonksiyonları güncelle
export const ensurePrismaSqliteSchema = ensurePrismaSchema;

export { prisma };


