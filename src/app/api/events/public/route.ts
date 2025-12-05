import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    // Build the where clause
    const whereClause: any = {};
    
    if (category && category !== "all") {
      whereClause.category = category;
    }

    // Fetch all public events
    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: {
        eventDate: 'asc'
      },
      include: {
        organizer: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    // Format the events for the response
    const formattedEvents = events.map(event => ({
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
      organizerName: `${event.organizer.firstName} ${event.organizer.lastName}`,
      createdAt: event.createdAt
    }));

    return NextResponse.json({ events: formattedEvents }, { status: 200 });
  } catch (error) {
    console.error("Error fetching public events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
