import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizerId = searchParams.get('organizerId');

    if (!organizerId) {
      return NextResponse.json(
        { error: 'Organizer ID is required' },
        { status: 400 }
      );
    }

    const events = await prisma.event.findMany({
      where: {
        organizerId: parseInt(organizerId),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
