import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      take: 20,
      orderBy: { id: 'desc' } // Assuming ID is sortable strings or change to sentAt
    });

    // Map to frontend interface
    const formattedCampaigns = campaigns.map(c => ({
      id: c.id,
      title: c.title,
      subject: c.subject,
      status: c.status,
      sentAt: c.sentAt,
      totalRecipients: c.recipients,
      totalSent: c.recipients,
      totalOpened: c.opened,
      deliveryRate: 0, // Calculate if needed
      openRate: c.recipients > 0 ? (c.opened / c.recipients) * 100 : 0,
      clickRate: 0,
      createdAt: c.createdAt,
    }));

    return NextResponse.json(formattedCampaigns);
  } catch (error) {
    console.error('Local DB Error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
