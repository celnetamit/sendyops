import mysql from 'mysql2/promise';
import { PrismaClient } from '@prisma/client';

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.warn('Database credentials not found in environment variables. Real data fetching will fail.');
}

// Remote Sendy Connection (Source)
export const sendyPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

// Local Database (Cache)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Ensure Prisma is initialized correctly
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function querySendy<T>(sql: string, params?: any[]): Promise<T> {
  const [rows] = await sendyPool.execute(sql, params);
  return rows as T;
}
