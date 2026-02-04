import { NextResponse } from 'next/server';
import { querySendy } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'bounced', 'complaint', 'unsubscribed'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    if (!status || !['bounced', 'complaint', 'unsubscribed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid or missing status parameter' }, { status: 400 });
    }

    // Build the query based on the requested status column
    // In Sendy 'subscribers' table, these serve as boolean flags (1 or 0) usually, 
    // or 'unsubscribed' might be a status string. 
    // Standard Sendy schema uses `bounced`, `complaint`, `unsubscribed` as TINYINT(1) columns.
    
    const countSql = `SELECT COUNT(*) as total FROM subscribers WHERE ${status} = 1`;
    const dataSql = `
      SELECT id, name, email, list, timestamp 
      FROM subscribers 
      WHERE ${status} = 1 
      ORDER BY timestamp DESC 
      LIMIT ? OFFSET ?
    `;

    // Get total count
    const countResult = await querySendy<{ total: number }[]>(countSql);
    const total = countResult[0]?.total || 0;

    // Get data
    const subscribers = await querySendy<any[]>(dataSql, [limit, offset]);

    return NextResponse.json({
      data: subscribers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers from Sendy DB' },
      { status: 500 }
    );
  }
}
