import { faker } from '@faker-js/faker';
import { 
  Campaign, 
  Subscriber, 
  EmailEvent, 
  CampaignStatus, 
  SubscriberStatus, 
  EmailEventType, 
  DashboardStats, 
  Alert, 
  TimeSeriesData, 
  RecentActivity 
} from '@/types';

export const initializeMockData = () => {
  // Generate Campaigns
  const campaigns: Campaign[] = Array.from({ length: 25 }).map(() => {
    const isSent = faker.datatype.boolean(0.7);
    const sentDate = faker.date.recent({ days: 30 });
    const totalSent = faker.number.int({ min: 100, max: 50000 });
    const deliveryRate = faker.number.float({ min: 85, max: 99.9, multipleOf: 0.1 });
    const totalDelivered = Math.floor(totalSent * (deliveryRate / 100));
    const totalBounced = totalSent - totalDelivered;
    const openRate = faker.number.float({ min: 15, max: 55, multipleOf: 0.1 });
    const totalOpened = Math.floor(totalDelivered * (openRate / 100));
    const clickRate = faker.number.float({ min: 2, max: 15, multipleOf: 0.1 });
    const totalClicked = Math.floor(totalOpened * (clickRate / 100));
    const totalUnsubscribed = faker.number.int({ min: 0, max: 50 });

    return {
      id: faker.string.uuid(),
      title: faker.company.catchPhrase(),
      subject: faker.lorem.sentence({ min: 4, max: 8 }),
      status: (isSent ? 'sent' : faker.helpers.arrayElement(['draft', 'scheduled', 'sending'])) as CampaignStatus,
      sentAt: isSent ? sentDate : undefined,
      createdAt: faker.date.recent({ days: 60 }),
      totalRecipients: totalSent,
      totalSent,
      totalDelivered,
      totalBounced,
      totalOpened,
      totalClicked,
      totalUnsubscribed,
      totalFailed: faker.number.int({ min: 0, max: 20 }),
      deliveryRate,
      openRate,
      clickRate,
      bounceRate: parseFloat(((totalBounced / totalSent) * 100).toFixed(2)),
      unsubscribeRate: parseFloat(((totalUnsubscribed / totalDelivered) * 100).toFixed(2)),
      listName: faker.commerce.department() + ' Subscribers',
      brandName: faker.company.name(),
      fromName: faker.person.fullName(),
      fromEmail: faker.internet.email(),
    };
  });

  // Generate Subscribers
  const subscribers: Subscriber[] = Array.from({ length: 100 }).map(() => {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      status: faker.helpers.arrayElement(['subscribed', 'subscribed', 'subscribed', 'unsubscribed', 'bounced']) as SubscriberStatus,
      listName: faker.commerce.department(),
      subscribedAt: faker.date.past({ years: 1 }),
      engagementScore: faker.number.int({ min: 0, max: 100 }),
      totalCampaignsReceived: faker.number.int({ min: 5, max: 50 }),
      totalOpens: faker.number.int({ min: 0, max: 40 }),
      totalClicks: faker.number.int({ min: 0, max: 20 }),
    };
  });

  // Generate Events
  const events: EmailEvent[] = Array.from({ length: 150 }).map(() => {
    const eventType = faker.helpers.arrayElement(['sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed', 'failed']) as EmailEventType;
    const recipient = faker.helpers.arrayElement(subscribers);
    const campaign = faker.helpers.arrayElement(campaigns);

    return {
      id: faker.string.uuid(),
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      recipientEmail: recipient.email,
      recipientName: recipient.name,
      eventType,
      eventTime: faker.date.recent({ days: 7 }),
      subject: campaign.subject,
      linkUrl: eventType === 'clicked' ? faker.internet.url() : undefined,
      bounceReason: eventType === 'bounced' ? 'Mailbox full' : undefined,
      failureReason: eventType === 'failed' ? 'SMTP Error' : undefined,
      location: {
        city: faker.location.city(),
        country: faker.location.country(),
      },
      userAgent: faker.internet.userAgent(),
    };
  });

  // Generate Dashboard Stats
  const sentCampaigns = campaigns.filter(c => c.status === 'sent');
  const stats: DashboardStats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => ['sending', 'scheduled'].includes(c.status)).length,
      totalEmailsSent: sentCampaigns.reduce((sum, c) => sum + c.totalSent, 0),
      totalDelivered: sentCampaigns.reduce((sum, c) => sum + c.totalDelivered, 0),
      totalOpened: sentCampaigns.reduce((sum, c) => sum + c.totalOpened, 0),
      totalClicked: sentCampaigns.reduce((sum, c) => sum + c.totalClicked, 0),
      totalBounced: sentCampaigns.reduce((sum, c) => sum + c.totalBounced, 0),
      totalFailed: sentCampaigns.reduce((sum, c) => sum + c.totalFailed, 0),
      averageDeliveryRate: 98.5,
      averageOpenRate: 32.4,
      averageClickRate: 12.1,
      averageBounceRate: 0.8,
      trendsVsPrevious: {
          campaigns: 12,
          sent: 5,
          delivered: 4,
          opened: 8,
          clicked: 2
      }
  };

  // Generate Alerts
  const alerts: Alert[] = campaigns.slice(0, 3).map((c, i) => ({
      id: `alert-${i}`,
      type: 'info',
      severity: 'info',
      title: 'Campaign Sent',
      message: `Campaign ${c.title} was sent successfully`,
      isAcknowledged: false,
      createdAt: new Date(),
      campaignId: c.id,
      campaignTitle: c.title
  }));

  // Generate TimeSeries
  const timeSeriesData: TimeSeriesData[] = Array.from({ length: 7 }).map((_, i) => ({
      date: faker.date.recent({ days: 7 }).toISOString().split('T')[0],
      sent: faker.number.int({ min: 1000, max: 5000 }),
      delivered: faker.number.int({ min: 900, max: 4800 }),
      opened: faker.number.int({ min: 400, max: 2000 }),
      clicked: faker.number.int({ min: 100, max: 500 }),
      bounced: faker.number.int({ min: 0, max: 50 })
  }));

  // Generate Recent Activity
  const recentActivity: RecentActivity[] = events.slice(0, 10).map(e => ({
      id: e.id,
      type: e.eventType,
      message: `${e.eventType} event for ${e.recipientEmail}`,
      timestamp: e.eventTime,
      campaignTitle: e.campaignTitle,
      email: e.recipientEmail
  }));

  return { campaigns, subscribers, events, stats, alerts, timeSeriesData, recentActivity };
};
