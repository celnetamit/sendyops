import { prisma, querySendy } from './db';

/**
 * Syncs data from remote Sendy MySQL to local SQLite
 */
export async function syncData() {
  const history = await prisma.syncHistory.create({
    data: { status: 'running' }
  });

  try {
    console.log('Starting sync...');

    // 1. Sync Campaigns
    console.log('Syncing campaigns...');
    const campaigns = await querySendy<any[]>(`
      SELECT id, title, subject, from_name, from_email, sent, recipients, opens 
      FROM campaigns 
      ORDER BY id DESC LIMIT 100
    `);

    for (const c of campaigns) {
      await prisma.campaign.upsert({
        where: { id: c.id.toString() },
        update: {
          title: c.title,
          subject: c.subject,
          status: c.sent ? 'sent' : 'draft',
          sentAt: c.sent ? new Date(parseInt(c.sent) * 1000) : null,
          recipients: parseInt(c.recipients) || 0,
          // Opens is tricky as it varies by Sendy version, treating as string count for now
          opened: typeof c.opens === 'string' ? (c.opens.split(',').length || 0) : (parseInt(c.opens) || 0),
          lastSyncedAt: new Date(),
        },
        create: {
          id: c.id.toString(),
          title: c.title,
          subject: c.subject,
          fromName: c.from_name,
          fromEmail: c.from_email,
          status: c.sent ? 'sent' : 'draft',
          sentAt: c.sent ? new Date(parseInt(c.sent) * 1000) : null,
          recipients: parseInt(c.recipients) || 0,
          opened: typeof c.opens === 'string' ? (c.opens.split(',').length || 0) : (parseInt(c.opens) || 0),
        }
      });
    }

    // 2. Sync Subscribers (Limit to recent active for performance in demo)
    console.log('Syncing subscribers...');
    // Note: 'subscribers' table can be huge. In production, use cursor-based pagination.
    // Here we fetch recent 500 for demo.
    const subscribers = await querySendy<any[]>(`
      SELECT id, email, name, list, unsubscribed, bounced, timestamp 
      FROM subscribers 
      ORDER BY timestamp DESC LIMIT 500
    `);

    await prisma.$transaction(
      subscribers.map(s => 
        prisma.subscriber.upsert({
          where: { email: s.email },
          update: {
            name: s.name,
            listId: s.list.toString(),
            status: s.bounced === 1 ? 'bounced' : (s.unsubscribed === 1 ? 'unsubscribed' : 'active'),
            lastSyncedAt: new Date()
          },
          create: {
            email: s.email,
            name: s.name,
            listId: s.list.toString(),
            status: s.bounced === 1 ? 'bounced' : (s.unsubscribed === 1 ? 'unsubscribed' : 'active'),
            timestamp: s.timestamp ? new Date(parseInt(s.timestamp) * 1000) : new Date()
          }
        })
      )
    );

    // 3. Sync Logs (simulated from campaign activity for now)
    // Sendy doesn't have a single 'logs' table unless using 'log' (which is deprecated/huge).
    // We already derive mail logs from campaigns in the API. We can store them if needed.

    await prisma.syncHistory.update({
      where: { id: history.id },
      data: { 
        status: 'success', 
        completedAt: new Date(),
        recordsProcessed: campaigns.length + subscribers.length
      }
    });

    console.log('Sync completed successfully.');
    return { success: true, records: campaigns.length + subscribers.length };

  } catch (error: any) {
    console.error('Sync failed:', error);
    await prisma.syncHistory.update({
      where: { id: history.id },
      data: { 
        status: 'failed', 
        completedAt: new Date(),
        error: error.message
      }
    });
    throw error;
  }
}
