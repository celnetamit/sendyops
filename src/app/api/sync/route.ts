import { NextResponse } from 'next/server';
import { syncData } from '@/lib/sync-service';

export async function POST() {
  try {
    const result = await syncData();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
