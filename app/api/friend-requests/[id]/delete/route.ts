import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "User not authenticated",
        },
        { status: 401 }
      );
    }

    const clerkId = user.id;

    // Fetch the receiver user from the database using clerkId
    const receiver = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!receiver) {
      return NextResponse.json(
        {
          error: "Receiver user not found",
        },
        { status: 404 }
      );
    }

    const senderId = parseInt(params.id, 10); // Ensure senderId is a number

    // Fetch the friend request using both senderId and receiverId
    const friendRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: senderId,
          receiverId: receiver.id,
        },
      },
    });

    if (!friendRequest) {
      return NextResponse.json(
        {
          error: "Friend request not found",
        },
        { status: 404 }
      );
    }

    // Delete the friend request
    await prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: senderId,
          receiverId: receiver.id,
        },
      },
    });

    // Fetch the sender details
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      return NextResponse.json(
        {
          error: "Sender user not found",
        },
        { status: 404 }
      );
    }

    // Create a notification for the sender, notifying them that their friend request was deleted
    await prisma.notification.create({
      data: {
        content: `${receiver.name} has deleted your friend request.`,
        userId: senderId, // Send the notification to the sender
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to remove friend request",
        details: (error as any).message,
      },
      { status: 500 }
    );
  }
}
