import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';

// Load .env manually since we are running a standalone script
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

async function testConnection() {
  console.log('Testing database connection with mysql2...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`Port: ${process.env.DB_PORT}`);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
    });
    console.log('✅ Successfully connected to database!');
    await connection.end();
  } catch (error: any) {
    console.error('❌ Failed to connect to database:');
    console.error(`Error Code: ${error.code}`);
    console.error(`Message: ${error.message}`);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('Verify your DB_USER and DB_PASSWORD in .env');
    }
    process.exit(1);
  }
}

testConnection();
