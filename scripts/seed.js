const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const { faker } = await import('@faker-js/faker');
  console.log('🌱 Starting seed...');

  // 1. Seed User
  const email = 'admin@sendy.com';
  const password = 'admin';
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

  console.log('👤 Seeded User:', user.email);

  // 2. Generate & Seed Campaigns
  const campaigns = [];
  for (let i = 0; i < 25; i++) {
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

    const generatedCampaign = {
      id: faker.string.uuid(),
      title: faker.company.catchPhrase(),
      subject: faker.lorem.sentence({ min: 4, max: 8 }),
      status: (isSent ? 'sent' : faker.helpers.arrayElement(['draft', 'scheduled', 'sending'])),
      sentAt: isSent ? sentDate : undefined,
      createdAt: faker.date.recent({ days: 60 }),
      recipients: totalSent, // Schema uses recipients for total sent
      
      // Analytics
      opened: totalOpened,
      clicked: totalClicked,
      bounced: totalBounced,
      unsubscribed: totalUnsubscribed,
      
      // Categorization
      category: faker.helpers.arrayElement(['courses', 'workshops', 'general']),
      senderName: faker.person.fullName(),
      senderDepartment: faker.commerce.department(),
      topic: faker.company.buzzPhrase(),
      targetAudience: faker.commerce.department() + ' Team',
      fromName: faker.person.fullName(),
      fromEmail: faker.internet.email(),
      
      lastSyncedAt: new Date()
    };
    campaigns.push(generatedCampaign);
  }

  for (const campaign of campaigns) {
    await prisma.campaign.upsert({
      where: { id: campaign.id },
      update: campaign,
      create: campaign,
    });
  }
  console.log(`📧 Seeded ${campaigns.length} Campaigns`);

  // 3. Generate & Seed Subscribers
  const subscribers = [];
  for (let i = 0; i < 100; i++) {
    const sub = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      listId: `list-${faker.number.int({ min: 1, max: 5 })}`,
      status: faker.helpers.arrayElement(['active', 'active', 'active', 'unsubscribed', 'bounced']),
      timestamp: faker.date.past({ years: 1 }),
      lastSyncedAt: new Date()
    };
    subscribers.push(sub);
  }

  for (const sub of subscribers) {
    await prisma.subscriber.upsert({
      where: { email: sub.email },
      update: sub,
      create: sub,
    });
  }
  console.log(`👥 Seeded ${subscribers.length} Subscribers`);

  // 4. Generate & Seed Event Logs
  const events = [];
  for (let i = 0; i < 150; i++) {
    const eventType = faker.helpers.arrayElement(['mail_sent', 'login', 'error']);
    let message = '';
    let details = '';

    if (eventType === 'mail_sent') {
      const camp = faker.helpers.arrayElement(campaigns);
      message = `Campaign "${camp.title}" sent`;
      details = JSON.stringify({ campaignId: camp.id });
    } else if (eventType === 'login') {
      message = `User login from ${faker.internet.ip()}`;
    } else {
      message = 'System warning or error';
      details = 'Connection timeout or sync mismatch';
    }

    events.push({
      type: eventType,
      message,
      timestamp: faker.date.recent({ days: 7 }),
      details
    });
  }

  for (const event of events) {
    await prisma.eventLog.create({ data: event });
  }
  console.log(`📜 Seeded ${events.length} Event Logs`);
  
  console.log('✅ Seeding completed!');
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

