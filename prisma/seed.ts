import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // 1. Clean up existing data
  await prisma.eventLog.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.subscriber.deleteMany()
  await prisma.user.deleteMany()

  console.log('Database cleaned.')

  // 2. Create Admin User
  await prisma.user.create({
    data: {
      email: 'admin@sendy.com',
      name: 'Admin User',
      password: 'hashed_password_here', // In real app use bcrypt
      role: 'admin'
    }
  })

  // 3. Create Subscribers (~500)
  console.log('Creating subscribers...')
  const subscribers = []
  const statuses = ['active', 'active', 'active', 'active', 'bounced', 'unsubscribed', 'unsubscribed', 'complaint'] // Weighted
  
  for (let i = 0; i < 500; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    subscribers.push({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      listId: 'LIST_1', // Dummy List ID
      status: status,
      timestamp: faker.date.past()
    })
  }

  await prisma.subscriber.createMany({
    data: subscribers
  })

  // 4. Create Campaigns (~30 for last 30 days)
  console.log('Creating campaigns...')
  const campaigns = []
  
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i) // Go back i days
    
    // Randomize delivery metrics
    const recipients = faker.number.int({ min: 100, max: 500 })
    const bounced = Math.floor(recipients * (faker.number.float({ min: 0.01, max: 0.05 })))
    const delivered = recipients - bounced
    const opened = Math.floor(delivered * (faker.number.float({ min: 0.2, max: 0.6 }))) // 20-60% open rate
    const clicked = Math.floor(opened * (faker.number.float({ min: 0.1, max: 0.3 }))) // 10-30% click rate
    const unsubscribed = Math.floor(delivered * (faker.number.float({ min: 0, max: 0.02 })))

    const isSent = i > 0 // Today's might be scheduled/draft
    const status = isSent ? 'sent' : (Math.random() > 0.5 ? 'scheduled' : 'draft')

    campaigns.push({
      id: faker.string.uuid(),
      title: `${faker.commerce.productName()} Workshop`,
      subject: faker.company.catchPhrase(),
      fromName: faker.person.fullName(),
      fromEmail: faker.internet.email(),
      content: '<h1>Hello!</h1><p>This is a test email.</p>',
      status: status,
      // Metrics
      recipients: isSent ? recipients : (status === 'scheduled' ? recipients : 0),
      opened: isSent ? opened : 0,
      clicked: isSent ? clicked : 0,
      bounced: isSent ? bounced : 0,
      unsubscribed: isSent ? unsubscribed : 0,
      // Dates
      sentAt: isSent ? date : null,
      createdAt: date,
      // Metadata
      category: faker.helpers.arrayElement(['courses', 'workshops', 'general']),
      senderName: faker.person.fullName(),
      senderDepartment: faker.commerce.department(),
      topic: faker.hacker.noun(),
      targetAudience: 'General List'
    })
  }

  await prisma.campaign.createMany({
    data: campaigns
  })

  // 5. Create Templates
  console.log('Creating templates...')
  const templates = [
    {
      id: faker.string.uuid(),
      title: 'Welcome Email',
      subject: 'Welcome to the Community! 👋',
      fromName: 'Community Team',
      fromEmail: 'welcome@sendy.com',
      status: 'template',
      recipients: 0,
      content: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">Welcome!</h1>
          <p>Hi there,</p>
          <p>Thanks for joining our newsletter. We're excited to have you on board.</p>
          <a href="#" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
        </div>
      `
    },
    {
      id: faker.string.uuid(),
      title: 'Monthly Newsletter',
      subject: 'Your Monthly Digest 📰',
      fromName: 'Editorial Team',
      fromEmail: 'newsletter@sendy.com',
      status: 'template',
      recipients: 0,
      content: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px;">
             <h2>THE MONTHLY DIGEST</h2>
             <p style="font-style: italic; color: #666;">Top stories picked for you</p>
          </div>
          <div style="margin-top: 20px;">
            <h3>Feature Story</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
          </div>
          <div style="margin-top: 20px; background: #f9f9f9; padding: 15px;">
            <h4>Quick Links</h4>
            <ul>
               <li><a href="#">New Updates</a></li>
               <li><a href="#">Community Highlights</a></li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: faker.string.uuid(),
      title: 'Product Launch',
      subject: 'Introducing our newest feature 🚀',
      fromName: 'Product Team',
      fromEmail: 'product@sendy.com',
      status: 'template',
      recipients: 0,
      content: `
        <div style="font-family: sans-serif; text-align: center;">
          <div style="background: #000; color: white; padding: 40px 20px;">
            <h1>It's Finally Here</h1>
            <p style="font-size: 18px;">Meet the all-new Dashboard.</p>
          </div>
          <div style="padding: 30px;">
             <p>We've completely redesigned your experience from the ground up.</p>
             <a href="#" style="background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; display: inline-block; margin-top: 20px;">Explore Now</a>
          </div>
        </div>
      `
    },
    {
      id: faker.string.uuid(),
      title: 'Webinar Invitation',
      subject: 'Invitation: Master Email Marketing 🎓',
      fromName: 'Events Team',
      fromEmail: 'events@sendy.com',
      status: 'template',
      recipients: 0,
      content: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background: #6366f1; color: white; padding: 30px; text-align: center;">
             <h2>Free Webinar</h2>
             <h1 style="margin: 10px 0;">Mastering Email ROI</h1>
          </div>
          <div style="padding: 30px;">
             <p>Join us for an exclusive deep dive into email analytics.</p>
             <p><strong>Date:</strong> October 24th, 2024<br><strong>Time:</strong> 2:00 PM EST</p>
             <a href="#" style="display: block; width: 100%; text-align: center; background: #6366f1; color: white; padding: 15px 0; text-decoration: none; border-radius: 5px; margin-top: 20px;">Save Your Spot</a>
          </div>
        </div>
      `
    },
    {
      id: faker.string.uuid(),
      title: 'Feedback Request',
      subject: 'How was your experience? ⭐',
      fromName: 'Support Team',
      fromEmail: 'support@sendy.com',
      status: 'template',
      recipients: 0,
      content: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; text-align: center;">
           <h3>We value your opinion</h3>
           <p>How likely are you to recommend us to a friend?</p>
           <div style="display: flex; justify-content: space-between; margin: 30px 0;">
              <a href="#" style="padding: 10px 15px; background: #eee; text-decoration: none; border-radius: 4px; color: #333;">1</a>
              <a href="#" style="padding: 10px 15px; background: #eee; text-decoration: none; border-radius: 4px; color: #333;">2</a>
              <a href="#" style="padding: 10px 15px; background: #eee; text-decoration: none; border-radius: 4px; color: #333;">3</a>
              <a href="#" style="padding: 10px 15px; background: #eee; text-decoration: none; border-radius: 4px; color: #333;">4</a>
              <a href="#" style="padding: 10px 15px; background: #eee; text-decoration: none; border-radius: 4px; color: #333;">5</a>
           </div>
           <a href="#">Take full survey</a>
        </div>
      `
    },
    {
      id: faker.string.uuid(),
      title: 'Flash Sale',
      subject: '24 Hours Only! ⚡',
      fromName: 'Sales Team',
      fromEmail: 'sales@sendy.com',
      status: 'template',
      recipients: 0,
      content: `
        <div style="font-family: sans-serif; border: 4px solid #ef4444; padding: 20px; text-align: center;">
           <h1 style="color: #ef4444; font-size: 48px; margin: 0;">ALE</h1>
           <p style="font-size: 24px;">50% OFF EVERYTHING</p>
           <p>Offer ends at midnight.</p>
           <a href="#" style="background: #ef4444; color: white; padding: 20px 40px; font-weight: bold; text-decoration: none; display: inline-block; margin-top: 20px;">SHOP SALE</a>
        </div>
      `
    }
  ]

  await prisma.campaign.createMany({
    data: templates
  })

  console.log(`Seeding finished. Created ${subscribers.length} subscribers and ${campaigns.length} campaigns.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
