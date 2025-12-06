import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      eventId,
      paymentReference,
      amount,
      paymentStatus,
    } = await request.json();

    // Validate required fields
    if (!userId || !eventId || !paymentReference) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if event exists and has available tickets
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const ticketsAvailable = event.totalTickets - event.ticketsSold;
    if (ticketsAvailable <= 0) {
      return NextResponse.json(
        { error: "Event is sold out" },
        { status: 400 }
      );
    }

    // Generate unique ticket code
    const ticketCode = `TKT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create ticket record
    const ticket = await prisma.ticket.create({
      data: {
        eventId: parseInt(eventId),
        userId: parseInt(userId),
        ticketCode,
        amountPaid: parseFloat(amount || "0"),
        status: paymentStatus === "success" ? "confirmed" : "pending",
        purchaseDate: new Date(),
      },
      include: {
        event: {
          select: {
            title: true,
            eventDate: true,
            startTime: true,
            venue: true,
            location: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Update event tickets sold count
    await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: {
        ticketsSold: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ticket purchased successfully",
        ticket: {
          id: ticket.id,
          ticketCode: ticket.ticketCode,
          status: ticket.status,
          event: ticket.event,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ticket purchase error:", error);
    return NextResponse.json(
      { error: "Failed to purchase ticket" },
      { status: 500 }
    );
  }
}
