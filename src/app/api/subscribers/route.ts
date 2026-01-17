import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Local DB Error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
