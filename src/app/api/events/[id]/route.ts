import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find event by slug first, then by ID for backward compatibility
    let event = await prisma.event.findUnique({
      where: { slug: id },
      include: {
        organizer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              paystackSplitCode: true,
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
      (ticket: { id: number; status: string }) => ticket.status === "confirmed"
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
      platformFeePercent: event.platformFeePercent,
      feeBearer: event.feeBearer,
      totalTickets: event.totalTickets,
      ticketsSold: ticketsSold,
      ticketsAvailable: event.totalTickets - ticketsSold,
      imageUrl: event.imageUrl,
      bannerUrl: event.bannerUrl,
      organizer: {
        id: event.organizer.id,
        name: `${event.organizer.firstName} ${event.organizer.lastName}`,
        email: event.organizer.email,
        paystackSplitCode: event.organizer.paystackSplitCode,
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
