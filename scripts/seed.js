const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Seed User
  const email = 'admin@sendy.com';
  const password = 'admin@sendy.com';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      name: 'Admin User',
      password: hashedPassword,
    },
  });

  console.log('Seeded User:', user.email);

  // 2. Seed Campaigns
  const campaignsData = [
    {
      id: '1',
      title: 'Summer Sale 2025',
      subject: 'Don\'t miss our biggest sale of the year!',
      status: 'sent',
      recipients: 5000,
      opened: 2450,
      clicked: 890,
      bounced: 45,
      unsubscribed: 12,
      sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      id: '2',
      title: 'Monthly Newsletter - June',
      subject: 'Your monthly update from Sendy Track',
      status: 'sent',
      recipients: 4800,
      opened: 3100,
      clicked: 1200,
      bounced: 30,
      unsubscribed: 8,
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: '3',
      title: 'Product Launch: New Analytics Dashboard',
      subject: 'Introducing our brand new tracking tools',
      status: 'sending',
      recipients: 6000,
      opened: 1200,
      clicked: 340,
      bounced: 15,
      unsubscribed: 3,
      sentAt: new Date(),
    },
    {
      id: '4',
      title: 'Welcome Series - Automated',
      subject: 'Welcome to the family!',
      status: 'scheduled',
      recipients: 0,
      sentAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    }
  ];

  for (const campaign of campaignsData) {
    await prisma.campaign.upsert({
      where: { id: campaign.id },
      update: campaign,
      create: campaign,
    });
  }
  console.log('Seeded Campaigns:', campaignsData.length);

  // 3. Seed Subscribers
  const subscribersData = [
    { email: 'john@example.com', name: 'John Doe', listId: 'L1', status: 'active' },
    { email: 'jane@example.com', name: 'Jane Smith', listId: 'L1', status: 'active' },
    { email: 'bob@example.com', name: 'Bob Wilson', listId: 'L2', status: 'bounced' },
    { email: 'alice@example.com', name: 'Alice Brown', listId: 'L1', status: 'unsubscribed' },
  ];

  for (const sub of subscribersData) {
    await prisma.subscriber.upsert({
      where: { email: sub.email },
      update: sub,
      create: sub,
    });
  }
  console.log('Seeded Subscribers:', subscribersData.length);

  // 4. Seed Event Logs
  const eventsData = [
    { type: 'mail_sent', message: 'Campaign "Summer Sale" sent to 5000 recipients', details: JSON.stringify({ campaignId: '1' }) },
    { type: 'login', message: 'Admin login from 192.168.1.1' },
    { type: 'error', message: 'Failed to sync with main server', details: 'Connection timeout' },
  ];

  for (const event of eventsData) {
    await prisma.eventLog.create({ data: event });
  }
  console.log('Seeded Event Logs:', eventsData.length);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

