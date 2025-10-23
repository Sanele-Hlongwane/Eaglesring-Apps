import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  const { id } = context.params; // ✅ correct access to params

  try {
    const user = await currentUser();

    if (!user) {
      console.error("User not authenticated");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const receiver = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!receiver) {
      console.error("Receiver user not found");
      return NextResponse.json(
        { error: "Receiver user not found" },
        { status: 404 }
      );
    }

    const senderId = parseInt(id, 10);
    if (isNaN(senderId)) {
      return NextResponse.json(
        { error: "Invalid sender ID" },
        { status: 400 }
      );
    }

    const friendRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId: receiver.id,
        },
      },
    });

    if (!friendRequest) {
      console.error("Friend request not found");
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 }
      );
    }

    const updatedFriendRequest = await prisma.friendRequest.update({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId: receiver.id,
        },
      },
      data: { status: "ACCEPTED" },
    });

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      return NextResponse.json(
        { error: "Sender user not found" },
        { status: 404 }
      );
    }

    await prisma.notification.create({
      data: {
        content: `${receiver.name} has accepted your friend request. You can now send messages.`,
        userId: senderId,
      },
    });

    console.debug(
      `Notification sent to Sender ID ${senderId}: "${receiver.name} has accepted your friend request"`
    );

    return NextResponse.json({ success: true, updatedFriendRequest });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return NextResponse.json(
      {
        error: "Failed to accept friend request",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
