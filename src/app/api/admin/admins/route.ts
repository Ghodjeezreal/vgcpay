import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const admins = await prisma.user.findMany({
      where: { isAdmin: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        accountType: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Failed to fetch admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        accountType: "organizer", // Default to organizer, can be changed
        isAdmin: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        isAdmin: admin.isAdmin,
      },
    });
  } catch (error) {
    console.error("Failed to create admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin account" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Count total admins
    const adminCount = await prisma.user.count({
      where: { isAdmin: true },
    });

    // Prevent deletion of last admin
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot revoke the last admin account" },
        { status: 400 }
      );
    }

    // Revoke admin privileges (don't delete the user)
    await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: false },
    });

    return NextResponse.json({
      success: true,
      message: "Admin privileges revoked successfully",
    });
  } catch (error) {
    console.error("Failed to revoke admin:", error);
    return NextResponse.json(
      { error: "Failed to revoke admin privileges" },
      { status: 500 }
    );
  }
}
