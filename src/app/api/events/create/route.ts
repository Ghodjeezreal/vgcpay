import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const {
      organizerId,
      title,
      description,
      category,
      eventDate,
      startTime,
      endTime,
      eventType,
      venue,
      location,
      ticketType,
      ticketPrice,
      totalTickets,
      feeBearer,
      imageUrl,
      bannerUrl,
    } = await request.json();

    // Validate required fields
    if (!organizerId || !title || !description || !category || !eventDate || !startTime || !endTime || !eventType || !totalTickets) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate physical event has venue and location
    if (eventType === 'physical' && (!venue || !location)) {
      return NextResponse.json(
        { error: 'Physical events must have a venue and location' },
        { status: 400 }
      );
    }

    // Validate paid event has price
    if (ticketType === 'paid' && (!ticketPrice || parseFloat(ticketPrice) <= 0)) {
      return NextResponse.json(
        { error: 'Paid events must have a valid ticket price' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existingEvent = await prisma.event.findUnique({
      where: { slug }
    });
    
    if (existingEvent) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        organizerId: parseInt(organizerId),
        slug,
        title,
        description,
        category,
        eventDate: new Date(eventDate),
        startTime: new Date(`${eventDate}T${startTime}`),
        endTime: new Date(`${eventDate}T${endTime}`),
        eventType,
        venue: eventType === 'physical' ? venue : null,
        location: eventType === 'physical' ? location : null,
        ticketType,
        ticketPrice: ticketType === 'paid' ? parseFloat(ticketPrice) : null,
        feeBearer: ticketType === 'paid' && feeBearer ? feeBearer : 'organizer',
        totalTickets: parseInt(totalTickets),
        ticketsSold: 0,
        imageUrl: imageUrl || null,
        bannerUrl: bannerUrl || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Event created successfully',
        event: {
          id: event.id,
          slug: event.slug,
          title: event.title,
          eventDate: event.eventDate,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
