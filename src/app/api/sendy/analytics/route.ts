import { NextResponse } from 'next/server';
import { querySendy } from '@/lib/db';

interface AnalyticsAggregate {
  total_sent: string | number;
  total_opened: string | number;
}

interface AnalyticsCampaign {
  id: string;
  title: string;
  subject: string;
  recipients: string | number;
  opens: string | number;
  from_name: string;
  posted_date: number | string;
}

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
    const overallStatsReq = querySendy<AnalyticsAggregate[]>(overallStatsSql);

    // 2. Fetch recent campaigns
    const campaignsSql = `
      SELECT id, title, subject, recipients, opens, from_name, posted_date
      FROM campaigns 
      WHERE recipients > 0
      ORDER BY id DESC 
      LIMIT 10
    `;
    const campaignsReq = querySendy<AnalyticsCampaign[]>(campaignsSql);

    const [overallStatsRes, campaignsRes] = await Promise.all([overallStatsReq, campaignsReq]);

    const sentVal = overallStatsRes[0]?.total_sent;
    const openedVal = overallStatsRes[0]?.total_opened;
    const totalSent = typeof sentVal === 'number' ? sentVal : parseInt(sentVal || '0');
    const totalOpened = typeof openedVal === 'number' ? openedVal : parseInt(openedVal || '0');
    
    // Calculate global open rate
    const globalOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0;

    // Process campaigns data
    const campaigns = campaignsRes.map((c) => {
        // Sendy stores opens as a string or int depending on version, often comma separated string of values if using opens table, 
        // BUT 'opens' column in campaigns table is typically the count.
        // Assuming 'opens' is an aggregation string (e.g. "123,456" opens? No, usually int).
        // Let's assume standard int or parsing needed.
        const openCount = typeof c.opens === 'number' ? c.opens : parseInt(c.opens || '0');
        const recipientCount = typeof c.recipients === 'number' ? c.recipients : parseInt(c.recipients || '0');
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
