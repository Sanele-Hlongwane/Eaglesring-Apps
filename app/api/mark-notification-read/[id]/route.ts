// src/app/api/mark-notification-read/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  context : any,
) {
  const { id } = context;

  // Convert the string id to a number
  const notificationId = parseInt(id, 10);

  if (isNaN(notificationId)) {
    return NextResponse.json(
      { message: "Invalid notification ID" },
      { status: 400 },
    );
  }

  try {
    // Get the current authenticated user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Update the notification in the database
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId }, // Use the number id here
      data: { read: true },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification:", error); // Log the error for debugging
    return NextResponse.json(
      { message: "Error marking notification as read" },
      { status: 500 },
    );
  }
}
