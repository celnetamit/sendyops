import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let where: any = {};
    if (type && type !== 'all') {
      if (type === 'mail') {
        where.type = 'mail_sent';
      } else if (type === 'login') {
        where.type = 'login';
      } else {
        where.type = type;
      }
    }

    const logs = await prisma.eventLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Local DB Error:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
