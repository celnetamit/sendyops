
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.campaign.updateMany({
    data: {
      senderName: 'Admin User',
      fromName: 'Sendy Team'
    }
  });
  console.log('Updated campaigns with sender details');
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
