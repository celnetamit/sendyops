import mysql from 'mysql2/promise';

async function testConnection() {
  const config = {
    host: 'localhost',
    user: 'rashika24',
    password: 'sendy24', // Testing this specific password from history
    database: 'sendy',
    port: 3306,
  };

  console.log('Testing specific credentials...');
  console.log(`User: ${config.user}`);
  console.log(`Bypassing .env to test known password: sendy24`);

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection successful with candidate credentials!');
    await connection.end();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Failed to connect with candidate credentials:');
    console.error(`Error Code: ${error.code}`);
    console.error(`Message: ${error.message}`);
    process.exit(1);
  }
}

testConnection();
