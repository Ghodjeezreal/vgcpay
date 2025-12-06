import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      kycType,
      // Personal fields
      fullName,
      dateOfBirth,
      phoneNumber,
      address,
      idType,
      idNumber,
      idDocumentUrl,
      // Business fields
      businessName,
      businessRegNumber,
      businessAddress,
      businessType,
      cacDocumentUrl,
      // Bank details
      bankName,
      accountNumber,
      accountName,
    } = body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if KYC already exists
    const existingKyc = await prisma.kycRequest.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (existingKyc) {
      // Update existing KYC
      const updatedKyc = await prisma.kycRequest.update({
        where: { userId: parseInt(userId) },
        data: {
          kycType,
          fullName,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          phoneNumber,
          address,
          idType,
          idNumber,
          idDocumentUrl,
          businessName,
          businessRegNumber,
          businessAddress,
          businessType,
          cacDocumentUrl,
          bankName,
          accountNumber,
          accountName,
        },
      });

      // Update user KYC status
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          kycStatus: "pending",
          kycType,
          kycSubmittedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: "KYC updated and resubmitted for review",
        kycRequest: updatedKyc,
      });
    }

    // Create new KYC request
    const kycRequest = await prisma.kycRequest.create({
      data: {
        userId: parseInt(userId),
        kycType,
        fullName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        phoneNumber,
        address,
        idType,
        idNumber,
        idDocumentUrl,
        businessName,
        businessRegNumber,
        businessAddress,
        businessType,
        cacDocumentUrl,
        bankName,
        accountNumber,
        accountName,
      },
    });

    // Update user KYC status
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        kycStatus: "pending",
        kycType,
        kycSubmittedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "KYC submitted successfully",
      kycRequest,
    });
  } catch (error) {
    console.error("Error submitting KYC:", error);
    return NextResponse.json(
      { error: "Failed to submit KYC" },
      { status: 500 }
    );
  }
}
