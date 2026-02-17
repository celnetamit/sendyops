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
    // Fallback Mock Data for demo/dev if DB fails
    const mockSubscribers = Array.from({ length: 5 }).map((_, i) => ({
      id: `mock-${i}`,
      email: `user${i}@example.com`,
      name: `Mock User ${i}`,
      listId: 'LIST_1',
      status: i % 2 === 0 ? 'active' : 'unsubscribed',
      timestamp: new Date().toISOString()
    }));
    return NextResponse.json(mockSubscribers);
  }
}
