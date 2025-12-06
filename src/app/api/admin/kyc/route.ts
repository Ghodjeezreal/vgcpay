import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all pending KYC requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      );
    }

    // Verify admin
    const admin = await prisma.user.findUnique({
      where: { id: parseInt(adminId) },
    });

    if (!admin || !admin.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get all KYC requests with user details
    const kycRequests = await prisma.kycRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            kycStatus: true,
            kycSubmittedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ kycRequests });
  } catch (error) {
    console.error("Error fetching KYC requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch KYC requests" },
      { status: 500 }
    );
  }
}

// Approve or reject KYC
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, userId, action, splitCode, rejectionReason } = body;

    // Verify admin
    const admin = await prisma.user.findUnique({
      where: { id: parseInt(adminId) },
    });

    if (!admin || !admin.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (action === "approve") {
      if (!splitCode) {
        return NextResponse.json(
          { error: "Split code is required for approval" },
          { status: 400 }
        );
      }

      // Approve KYC and assign split code
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          kycStatus: "approved",
          kycApprovedAt: new Date(),
          paystackSplitCode: splitCode,
        },
      });

      return NextResponse.json({
        message: "KYC approved and split code assigned",
      });
    } else if (action === "reject") {
      // Reject KYC
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          kycStatus: "rejected",
          kycRejectedAt: new Date(),
          kycRejectionReason: rejectionReason || "KYC verification failed",
        },
      });

      return NextResponse.json({
        message: "KYC rejected",
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing KYC:", error);
    return NextResponse.json(
      { error: "Failed to process KYC" },
      { status: 500 }
    );
  }
}
