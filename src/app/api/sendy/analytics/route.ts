import { NextResponse } from 'next/server';
import { querySendy } from '@/lib/db';

export async function GET() {
  try {
    // 1. Fetch overall stats (Total emails sent, total opens, etc. - simplified)
    // Note: 'recipients' column in campaigns table stores the sending count per campaign.
    const overallStatsSql = `
      SELECT 
        SUM(recipients) as total_sent,
        SUM(opens) as total_opened
      FROM campaigns
    `;
    const overallStatsReq = querySendy<any[]>(overallStatsSql);

    // 2. Fetch recent campaigns
    const campaignsSql = `
      SELECT id, title, subject, recipients, opens, from_name, posted_date
      FROM campaigns 
      WHERE recipients > 0
      ORDER BY id DESC 
      LIMIT 10
    `;
    const campaignsReq = querySendy<any[]>(campaignsSql);

    const [overallStatsRes, campaignsRes] = await Promise.all([overallStatsReq, campaignsReq]);

    const totalSent = overallStatsRes[0]?.total_sent || 0;
    const totalOpened = overallStatsRes[0]?.total_opened || 0;
    
    // Calculate global open rate
    const globalOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0;

    // Process campaigns data
    const campaigns = campaignsRes.map((c: any) => {
        // Sendy stores opens as a string or int depending on version, often comma separated string of values if using opens table, 
        // BUT 'opens' column in campaigns table is typically the count.
        // Assuming 'opens' is an aggregation string (e.g. "123,456" opens? No, usually int).
        // Let's assume standard int or parsing needed.
        const openCount = parseInt(c.opens || '0');
        const recipientCount = parseInt(c.recipients || '0');
        const rate = recipientCount > 0 ? ((openCount / recipientCount) * 100).toFixed(1) : 0;

        return {
            id: c.id,
            title: c.title,
            subject: c.subject,
            sent: recipientCount,
            opens: openCount,
            openRate: rate,
            date: c.posted_date // UNIX timestamp or Date string? Sendy usually uses UNIX timestamp or formatting
        };
    });

    return NextResponse.json({
      overview: {
        totalSent,
        totalOpened,
        globalOpenRate
      },
      recentCampaigns: campaigns
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics from Sendy DB' },
      { status: 500 }
    );
  }
}
