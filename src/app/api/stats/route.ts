import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch from Local Cache (SQLite) - INSTANT
    const totalCampaigns = await prisma.campaign.count();
    
    // Aggregations
    const aggregations = await prisma.campaign.aggregate({
      _sum: {
        recipients: true,
        opened: true,
        clicked: true,
        bounced: true,
      }
    });

    const totalSubscribers = await prisma.subscriber.count({
      where: { status: 'active' }
    });

    const totalSent = aggregations._sum.recipients || 0;
    const totalOpened = aggregations._sum.opened || 0;
    const totalClicked = aggregations._sum.clicked || 0;
    const totalBounced = aggregations._sum.bounced || 0;

    // Calculate rates
    const deliveryRate = totalSent > 0 ? ((totalSent - totalBounced) / totalSent) * 100 : 0;
    const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;

    const stats = {
      totalCampaigns,
      activeCampaigns: await prisma.campaign.count({ where: { status: { in: ['sending', 'scheduled'] } } }),
      totalEmailsSent: totalSent,
      totalDelivered: totalSent - totalBounced,
      totalOpened, 
      totalClicked,
      totalBounced,
      totalFailed: 0, // Not explicitly tracked in simple schema yet
      averageDeliveryRate: deliveryRate,
      averageOpenRate: openRate,
      averageClickRate: clickRate,
      averageBounceRate: 0,
      totalSubscribers,
      trendsVsPrevious: {
        campaigns: 0, // Can implement comp later
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Local DB Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
