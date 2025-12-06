import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        kycStatus: true,
        kycType: true,
        kycSubmittedAt: true,
        kycApprovedAt: true,
        kycRejectedAt: true,
        kycRejectionReason: true,
      },
    });

    const kycRequest = await prisma.kycRequest.findUnique({
      where: { userId: parseInt(userId) },
    });

    return NextResponse.json({
      kycStatus: user?.kycStatus || "not_submitted",
      kycType: user?.kycType,
      kycSubmittedAt: user?.kycSubmittedAt,
      kycApprovedAt: user?.kycApprovedAt,
      kycRejectedAt: user?.kycRejectedAt,
      kycRejectionReason: user?.kycRejectionReason,
      kycRequest,
    });
  } catch (error) {
    console.error("Error fetching KYC status:", error);
    return NextResponse.json(
      { error: "Failed to fetch KYC status" },
      { status: 500 }
    );
  }
}
