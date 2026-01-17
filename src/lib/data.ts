import { prisma } from '@/lib/db';

export async function getCampaigns() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return campaigns;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch campaigns.');
  }
}

export async function getAnalytics() {
  try {
    const campaigns = await prisma.campaign.findMany();
    
    const totalSent = campaigns.reduce((acc, c) => acc + c.recipients, 0);
    const totalOpened = campaigns.reduce((acc, c) => acc + c.opened, 0);
    const totalClicked = campaigns.reduce((acc, c) => acc + c.clicked, 0);
    const totalBounced = campaigns.reduce((acc, c) => acc + c.bounced, 0);
    
    return {
      totalSent,
      totalOpened,
      totalClicked,
      totalBounced,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch analytics.');
  }
}

export async function getSubscribers() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { timestamp: 'desc' },
    });
    return subscribers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch subscribers.');
  }
}
