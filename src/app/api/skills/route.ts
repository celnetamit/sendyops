import { NextResponse } from 'next/server';

const AVAILABLE_SKILLS = [
  {
    id: 'sendy-integration',
    name: 'Sendy Connection',
    description: 'Connect to your self-hosted Sendy installation to sync subscribers and campaigns.',
    version: '1.2.0',
    installed: true,
    icon: 'Link2', // Lucide icon name
    category: 'Integration'
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Unlock deeper insights with heatmaps, geographic data, and device tracking.',
    version: '0.9.0',
    installed: false,
    icon: 'BarChart3',
    category: 'Analytics'
  },
  {
    id: 'ai-writer',
    name: 'AI Campaign Writer',
    description: 'Generate high-converting email copy instantly using AI.',
    version: '1.0.1',
    installed: false,
    icon: 'Sparkles',
    category: 'AI Tool'
  },
  {
    id: 'template-library',
    name: 'Premium Templates',
    description: 'Access 50+ professionally designed email templates.',
    version: '2.1.0',
    installed: false,
    icon: 'Layout',
    category: 'Content'
  }
];

export async function GET() {
  // In a real app, 'installed' status would come from DB
  return NextResponse.json(AVAILABLE_SKILLS);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { name, category, level } = body;
  
  // Implementation placeholder
  return NextResponse.json({ message: 'Skill updated', data: { name, category, level } });
}

export async function DELETE() {
  // Implementation placeholder
  return NextResponse.json({ message: 'Skill deleted' });
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    
    // Simulate install/uninstall delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ 
        success: true, 
        message: `Successfully ${action === 'install' ? 'installed' : 'uninstalled'} skill` 
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}
