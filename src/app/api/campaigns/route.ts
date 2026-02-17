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
    console.error('Local DB Error, returning dummy data:', error);
    
    // Dummy data fallback
    const dummyCampaigns = Array.from({ length: 5 }).map((_, i) => ({
      id: `dummy-${i}`,
      title: `Sample Campaign ${i + 1}`,
      subject: `Weekly Newsletter ${i + 1}: exciting updates!`,
      status: ['sent', 'scheduled', 'draft'][i % 3],
      sentAt: new Date(Date.now() - i * 86400000).toISOString(),
      category: ['courses', 'workshops', 'general'][i % 3],
      senderName: 'John Doe',
      senderDepartment: 'Marketing',
      topic: 'General Updates',
      targetAudience: 'All Subscribers',
      fromName: 'John Doe',
      fromEmail: 'john@example.com',
      recipients: 1000 + i * 100,
      totalRecipients: 1000 + i * 100,
      totalSent: 1000 + i * 100,
      totalOpened: 500 + i * 50,
      opened: 500 + i * 50,
      clicked: 200 + i * 20,
      bounced: 10 + i,
      unsubscribed: 5,
      deliveryRate: 99,
      openRate: 50,
      clickRate: 20,
      createdAt: new Date().toISOString(),
      brandName: 'Marketing',
      listName: 'All Subscribers',
    }));

    return NextResponse.json(dummyCampaigns);
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
