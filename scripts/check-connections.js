const mysql = require('mysql2/promise');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testConnections() {
  console.log('--- Testing Database Connections ---');

  // 1. Test Prisma (Postgres)
  console.log('\n1. Testing Prisma (Local DB)...');
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ Prisma Connection Successful');
    const userCount = await prisma.user.count();
    console.log(`   User count: ${userCount}`);
  } catch (error) {
    console.error('❌ Prisma Connection Failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }

  // 2. Test Sendy (MySQL)
  console.log('\n2. Testing Sendy (Remote MySQL)...');
  if (!process.env.DB_HOST) {
      console.log('⚠️  Skipping Sendy test: DB_HOST not defined');
      return;
  }

  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
  };

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Sendy MySQL Connection Successful');
    await connection.end();
  } catch (error) {
    console.error('❌ Sendy MySQL Connection Failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
        console.error('   Hint: Check if the host is reachable and port is open.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('   Hint: Check username and password.');
    }
  }
}

testConnections();
