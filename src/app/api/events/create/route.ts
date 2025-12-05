import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Create event
    const event = await prisma.event.create({
      data: {
        organizerId: parseInt(organizerId),
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
        totalTickets: parseInt(totalTickets),
        ticketsSold: 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Event created successfully',
        event: {
          id: event.id,
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
