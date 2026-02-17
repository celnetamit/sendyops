import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results = {
    env: {
      items: {
        DB_HOST: process.env.DB_HOST ? 'Defined' : 'Missing',
        DB_USER: process.env.DB_USER ? 'Defined' : 'Missing',
        DB_NAME: process.env.DB_NAME ? 'Defined' : 'Missing',
        DATABASE_URL: process.env.DATABASE_URL ? 'Defined' : 'Missing',
        NODE_ENV: process.env.NODE_ENV,
        AUTH_SECRET: process.env.AUTH_SECRET ? 'Set (OK)' : 'MISSING (Login will fail)',
        ACCESS_PASSWORD: process.env.ACCESS_PASSWORD ? 'Set' : 'Not Set (Using default: password123)',
      }
    },
    connections: {
      prisma: { status: 'pending', error: null as string | null },
      sendy: { status: 'pending', error: null as string | null }
    }
  };

  // 1. Test Prisma (Postgres)
  try {
    // Attempt a simple query
    await prisma.$queryRaw`SELECT 1`;
    results.connections.prisma.status = 'success';
  } catch (error: unknown) {
    results.connections.prisma.status = 'failed';
    results.connections.prisma.error = (error as Error).message;
  }

  // 2. Test Sendy (MySQL)
  try {
    if (!process.env.DB_HOST) throw new Error('DB_HOST not defined');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
      connectTimeout: 5000 
    });
    
    await connection.ping();
    await connection.end();
    results.connections.sendy.status = 'success';
  } catch (error: unknown) {
    results.connections.sendy.status = 'failed';
    results.connections.sendy.error = (error as Error).message;
  }

  return NextResponse.json(results, { status: 200 });
}
