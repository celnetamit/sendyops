import { NextResponse } from 'next/server';
import { querySendy } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch Aggregated Stats from Sendy DB (Remote)
    // Sendy 'campaigns' table has 'recipients' (sent count) and 'opens' (open count).
    // 'subscribers' table has status.
    
    // Total Campaigns
    const [campaignCount] = await querySendy<any[]>('SELECT COUNT(*) as count FROM campaigns');
    const totalCampaigns = campaignCount.count;

    // Active Campaigns (sending/prepared?) - Sendy specific logic might vary, usually 'to_send' > 'recipients'? 
    // For simplicity, we'll just count total for now or check check specific 'sent' column string if we knew it.
    // We'll stick to total campaigns for "active" metric placeholder or use recently added.
    const activeCampaigns = 0; 

    // Aggregations (Sent, Opened)
    const [aggregates] = await querySendy<any[]>(`
      SELECT 
        SUM(recipients) as total_sent, 
        SUM(opens) as total_opened 
      FROM campaigns
    `);
    
    // Subscribers Count
    const [subCount] = await querySendy<any[]>('SELECT COUNT(*) as count FROM subscribers WHERE unsubscribed = 0 AND bounced = 0 AND complaint = 0');
    const totalSubscribers = subCount.count;

    // Bounces? Sendy tracks bounces in 'subscribers' table (bounced = 1) or 'bouncelog'? 
    // Calculating total bounces globally is expensive if scanning big subscriber table.
    // We'll calculate "Bounced" count from subscribers table for now.
    const [bounceCount] = await querySendy<any[]>('SELECT COUNT(*) as count FROM subscribers WHERE bounced = 1');
    const totalBounced = bounceCount.count;

    const totalSent = parseInt(aggregates.total_sent || '0');
    const totalOpened = parseInt(aggregates.total_opened || '0');
    
    // Clicks? Sendy tracks clicks in 'link_clicks' table.
    const [clickCount] = await querySendy<any[]>('SELECT COUNT(*) as count FROM link_clicks');
    const totalClicked = clickCount.count;

    const totalDelivered = totalSent - totalBounced; // Approximation

    // 2. Generate Time Series Data (Last 30 Days)
    // Group by 'posted_date' (Unix Timestamp)
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);

    const timeSeriesSql = `
      SELECT 
        FROM_UNIXTIME(posted_date, '%Y-%m-%d') as date,
        SUM(recipients) as sent,
        SUM(opens) as opened
      FROM campaigns
      WHERE posted_date > ?
      GROUP BY date
      ORDER BY date ASC
    `;
    
    const timeSeriesRows = await querySendy<any[]>(timeSeriesSql, [thirtyDaysAgo]);

    // Fill in missing dates
    const dailyStats = new Map<string, { sent: number, opened: number, clicked: number, delivered: number }>();
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        dailyStats.set(dateStr, { sent: 0, opened: 0, clicked: 0, delivered: 0 });
    }

    timeSeriesRows.forEach((row: any) => {
        const dateStr = row.date;
        const current = dailyStats.get(dateStr) || { sent: 0, opened: 0, clicked: 0, delivered: 0 };
        current.sent = parseInt(row.sent || '0');
        current.opened = parseInt(row.opened || '0');
        // Simple logic: delivered = sent (ignoring daily bounce mapping for speed)
        current.delivered = current.sent; 
        dailyStats.set(dateStr, current);
    });

    const timeSeriesData = Array.from(dailyStats.entries())
        .map(([date, data]) => ({ 
            date, 
            ...data,
            bounced: 0, // Hard to map bounces to specific campaign dates without complex join
            clicked: 0  // Link clicks need joining with links table and timestamp
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // Rates
    const deliveryRate = totalSent > 0 ? ((totalDelivered) / totalSent) * 100 : 0;
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;

    const stats = {
      totalCampaigns,
      activeCampaigns,
      totalEmailsSent: totalSent,
      totalDelivered,
      totalOpened, 
      totalClicked,
      totalBounced,
      totalFailed: 0, 
      averageDeliveryRate: deliveryRate,
      averageOpenRate: openRate,
      averageClickRate: clickRate,
      averageBounceRate: totalSent > 0 ? (totalBounced / totalSent) * 100 : 0,
      totalSubscribers,
      trendsVsPrevious: { sent: 0, delivered: 0, opened: 0, clicked: 0 },
      timeSeriesData
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Sendy DB Connection Error:', error);
    // Fallback to empty structure if DB connection fails, so UI doesn't crash
    return NextResponse.json({ 
        totalCampaigns: 0, 
        timeSeriesData: [],
        error: 'Failed to connect to Sendy Database. Please check your .env configuration.'
    }, { status: 200 }); // Return 200 with empty data to avoid 500 error page
  }
}
