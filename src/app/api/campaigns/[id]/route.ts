import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Format campaign details
    const campaignDetail = {
      id: campaign.id,
      title: campaign.title,
      subject: campaign.subject,
      status: campaign.status,
      sentAt: campaign.sentAt,
      createdAt: campaign.createdAt,
      
      // Sender information
      senderName: campaign.senderName,
      senderDepartment: campaign.senderDepartment,
      fromName: campaign.fromName,
      fromEmail: campaign.fromEmail,
      
      // Campaign details
      category: campaign.category,
      topic: campaign.topic,
      targetAudience: campaign.targetAudience,
      
      // Metrics
      recipients: campaign.recipients,
      opened: campaign.opened,
      clicked: campaign.clicked,
      bounced: campaign.bounced,
      unsubscribed: campaign.unsubscribed,
      
      // Calculated rates
      deliveryRate: campaign.recipients > 0 
        ? ((campaign.recipients - campaign.bounced) / campaign.recipients) * 100 
        : 0,
      openRate: campaign.recipients > 0 
        ? (campaign.opened / campaign.recipients) * 100 
        : 0,
      clickRate: campaign.recipients > 0 
        ? (campaign.clicked / campaign.recipients) * 100 
        : 0,
      bounceRate: campaign.recipients > 0 
        ? (campaign.bounced / campaign.recipients) * 100 
        : 0,
      unsubscribeRate: campaign.recipients > 0 
        ? (campaign.unsubscribed / campaign.recipients) * 100 
        : 0,
    };

    return NextResponse.json(campaignDetail);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}
