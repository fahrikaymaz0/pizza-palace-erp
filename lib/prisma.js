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

const getDialect = () => {
	const url = getDatabaseUrl();
	if (url.startsWith('postgres')) return 'postgres';
	if (url.startsWith('file:')) return 'sqlite';
	return 'unknown';
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

// Schema'yı kontrol et ve gerekirse oluştur (dialect'e göre)
export const ensurePrismaSchema = async () => {
	try {
		const client = createPrismaClient();
		const dialect = getDialect();

		// TIP: TIMESTAMP kullanıyoruz (SQLite kabul eder), BOOLEAN/INTEGER/REAL/TEXT tipleri iki tarafta da çalışır
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
				"verificationExpires" TIMESTAMP,
				"lastLogin" TIMESTAMP,
				"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY ("id")
			)
		`;

		await client.$executeRaw`
			CREATE TABLE IF NOT EXISTS "AppSetting" (
				"id" TEXT NOT NULL,
				"key" TEXT NOT NULL UNIQUE,
				"value" TEXT,
				"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY ("id")
			)
		`;

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
				"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY ("id")
			)
		`;

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
				"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY ("id")
			)
		`;

		await client.$executeRaw`
			CREATE TABLE IF NOT EXISTS "ChatRoom" (
				"id" TEXT NOT NULL,
				"userId" TEXT,
				"adminId" TEXT,
				"status" TEXT DEFAULT 'active',
				"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY ("id")
			)
		`;

		await client.$executeRaw`
			CREATE TABLE IF NOT EXISTS "ChatMessage" (
				"id" TEXT NOT NULL,
				"roomId" TEXT NOT NULL,
				"senderId" TEXT NOT NULL,
				"senderType" TEXT NOT NULL,
				"message" TEXT NOT NULL,
				"isRead" BOOLEAN DEFAULT false,
				"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY ("id")
			)
		`;

		console.log('Database schema checked and updated');
	} catch (error) {
		console.error('Schema check error:', error);
		throw error;
	}
};

// User tablosunda lastLogin kolonunu kontrol et (dialect'e göre)
export const ensureUserLastLoginColumn = async () => {
	try {
		const client = createPrismaClient();
		const dialect = getDialect();

		if (dialect === 'sqlite') {
			const columns = await client.$queryRaw`
				PRAGMA table_info("User")
			`;
			const hasLastLogin = Array.isArray(columns) && columns.some((c) => c.name === 'lastLogin');
			if (!hasLastLogin) {
				await client.$executeRaw`
					ALTER TABLE "User" ADD COLUMN "lastLogin" TIMESTAMP
				`;
				console.log('Added lastLogin column to User table (sqlite)');
			}
		} else if (dialect === 'postgres') {
			await client.$executeRaw`
				ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLogin" TIMESTAMP
			`;
			console.log('Ensured lastLogin column on User table (postgres)');
		}
	} catch (error) {
		console.error('LastLogin column check error:', error);
	}
};

// AppSetting tablosunu kontrol et (dialect'ten bağımsız CREATE IF NOT EXISTS yeterli)
export const ensureAppSettingTable = async () => {
	try {
		const client = createPrismaClient();
		await client.$executeRaw`
			CREATE TABLE IF NOT EXISTS "AppSetting" (
				"id" TEXT NOT NULL,
				"key" TEXT NOT NULL UNIQUE,
				"value" TEXT,
				"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY ("id")
			)
		`;
	} catch (error) {
		console.error('AppSetting table check error:', error);
	}
};

// Eski fonksiyonları güncelle
export const ensurePrismaSqliteSchema = ensurePrismaSchema;

export { prisma };


