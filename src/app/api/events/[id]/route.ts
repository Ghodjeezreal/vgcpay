import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tickets: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Calculate tickets sold
    const ticketsSold = event.tickets.filter(
      (ticket) => ticket.status === "confirmed"
    ).length;

    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      eventType: event.eventType,
      venue: event.venue,
      location: event.location,
      ticketType: event.ticketType,
      ticketPrice: event.ticketPrice,
      totalTickets: event.totalTickets,
      ticketsSold: ticketsSold,
      ticketsAvailable: event.totalTickets - ticketsSold,
      organizer: {
        id: event.organizer.id,
        name: `${event.organizer.firstName} ${event.organizer.lastName}`,
        email: event.organizer.email,
      },
      createdAt: event.createdAt,
    };

    return NextResponse.json({ event: formattedEvent }, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
