import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const templates = await prisma.campaign.findMany({
      where: {
        status: 'template'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subject, content } = body;

    if (!title || !subject) {
        return NextResponse.json({ error: 'Title and Subject are required' }, { status: 400 });
    }

    const template = await prisma.campaign.create({
      data: {
        id: crypto.randomUUID(),
        title,
        subject,
        content: content || '',
        status: 'template',
        // defaults
        fromName: '',
        fromEmail: '',
        recipients: 0
      }
    });

    return NextResponse.json(template);

  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
