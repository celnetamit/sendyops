import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sender = searchParams.get('sender');

    // Build filter conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (sender) {
      where.OR = [
        { senderName: { contains: sender } },
        { fromName: { contains: sender } },
        { fromEmail: { contains: sender } }
      ];
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      take: 100,
      orderBy: { createdAt: 'desc' }
    });

    // Map to frontend interface
    const formattedCampaigns = campaigns.map(c => ({
      id: c.id,
      title: c.title,
      subject: c.subject,
      status: c.status,
      sentAt: c.sentAt,
      
      // Enhanced tracking fields
      category: c.category,
      senderName: c.senderName,
      senderDepartment: c.senderDepartment,
      topic: c.topic,
      targetAudience: c.targetAudience,
      fromName: c.fromName,
      fromEmail: c.fromEmail,
      
      // Metrics
      recipients: c.recipients,
      totalRecipients: c.recipients,
      totalSent: c.recipients,
      totalOpened: c.opened,
      opened: c.opened,
      clicked: c.clicked,
      bounced: c.bounced,
      unsubscribed: c.unsubscribed,
      deliveryRate: 0,
      openRate: c.recipients > 0 ? (c.opened / c.recipients) * 100 : 0,
      clickRate: 0,
      createdAt: c.createdAt,
      
      // Legacy fields for compatibility
      brandName: c.senderDepartment || 'N/A',
      listName: c.targetAudience || 'General',
    }));

    return NextResponse.json(formattedCampaigns);
  } catch (error) {
    console.error('Local DB Error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subject, fromName, fromEmail, content, category } = body;

    const campaign = await prisma.campaign.create({
      data: {
        id: crypto.randomUUID(),
        title,
        subject,
        fromName,
        fromEmail,
        content,
        category,
        status: 'draft',
        recipients: 0
      }
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
