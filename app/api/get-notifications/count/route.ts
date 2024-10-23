import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const clerkId = user.id;

    // Fetch user from database using clerkId
    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    // Fetch count of unread notifications
    const unreadNotificationsCount = await prisma.notification.count({
      where: {
        userId: existingUser.id,
        read: false,
      },
    });

    return NextResponse.json({ count: unreadNotificationsCount });
  } catch (error) {
    console.error("Error fetching notifications count", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
