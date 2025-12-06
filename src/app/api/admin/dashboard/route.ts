import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {

    // Fetch dashboard statistics
    const [
      totalUsers,
      totalOrganizers,
      totalAttendees,
      totalAdmins,
      totalEvents,
      pendingKyc,
      approvedKyc,
      rejectedKyc,
      recentUsers,
      recentKyc,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { accountType: "organizer" } }),
      prisma.user.count({ where: { accountType: "attendee" } }),
      prisma.user.count({ where: { isAdmin: true } }),
      prisma.event.count(),
      prisma.user.count({ where: { kycStatus: "pending" } }),
      prisma.user.count({ where: { kycStatus: "approved" } }),
      prisma.user.count({ where: { kycStatus: "rejected" } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          accountType: true,
          createdAt: true,
        },
      }),
      prisma.kycRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Build recent activity feed
    const recentActivity = [
      ...recentUsers.map((u) => ({
        id: `user-${u.id}`,
        type: "user",
        description: `New ${u.accountType} registered: ${u.firstName} ${u.lastName}`,
        timestamp: u.createdAt.toISOString(),
      })),
      ...recentKyc.map((k) => ({
        id: `kyc-${k.id}`,
        type: "kyc",
        description: `KYC ${k.kycType} request from ${k.user.firstName} ${k.user.lastName}`,
        timestamp: k.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    const stats = {
      totalUsers,
      totalOrganizers,
      totalAttendees,
      totalAdmins,
      totalEvents,
      pendingKyc,
      approvedKyc,
      rejectedKyc,
    };

    return NextResponse.json({
      stats,
      recentActivity,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
