import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { subscriberId: string } }) {
  try {
    const { subscriberId } = params;

    // 1. Fetch Subscriber from Local DB (Prisma)
    // We assume subscriberId is the local UUID.
    const subscriber = await prisma.subscriber.findUnique({
      where: { id: subscriberId }
    });

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    // 2. Fetch Activity History
    // Since we don't sync individual activity to local DB yet, we can try to query Sendy.
    // However, Sendy's structure for individual logs is complex or sometimes just count-based.
    // For this MVP, we will try to fetch from Sendy if we have the email.
    
    // Check if we can get data from Sendy 'campaigns' table joined with 'links' or logs?
    // Simplified User Analytics for now:
    // We will simulate timeline data or fetch from local EventLog if available.
    // If we had a sync process, we would query local.
    
    // Let's create a placeholder structure that can be expanded.
    // Real implementation would require querying Sendy's `ares_emails` or `campaigns` log tables if they exist.
    // Usually Sendy doesn't expose a simple "get all activity for email X" API efficiently.
    
    // PLAN B: Mock activity for demonstration if real data isn't easily accessible without a heavy query.
    // But we should try to get *some* real data if possible.
    // Let's return the subscriber profile + mock activity for now to enable the UI.
    
    // We can fetch campaigns sent to the list they belong to? 
    // subscriber.listId -> find campaigns with this list.
    
    const activityHistory = [
      {
        id: '1',
        type: 'subscribed',
        title: 'Joined List',
        timestamp: subscriber.timestamp,
        details: 'Subscribed via form'
      }
    ];

    // If we have campaigns in local DB, assume they might have received them if active?
    // This is an approximation.
    
    const profile = {
      ...subscriber,
      stats: {
        totalSent: 0,
        openRate: 0,
        clickRate: 0
      },
      activity: activityHistory
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching subscriber details:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriber details' }, { status: 500 });
  }
}
