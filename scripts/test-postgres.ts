import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPostgres() {
  console.log('Testing Postgres Connection via Prisma...');
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to Postgres database!');
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database.`);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Failed to connect to Postgres database:');
    console.error(error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testPostgres();
