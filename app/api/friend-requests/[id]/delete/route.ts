import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  const { id } = context.params; // ✅ access params from context
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const receiver = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver user not found" },
        { status: 404 }
      );
    }

    const senderId = parseInt(id, 10);
    if (isNaN(senderId)) {
      return NextResponse.json({ error: "Invalid sender ID" }, { status: 400 });
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
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 }
      );
    }

    await prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId: receiver.id,
        },
      },
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
        content: `${receiver.name} has deleted your friend request.`,
        userId: senderId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting friend request:", error);
    return NextResponse.json(
      {
        error: "Failed to remove friend request",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
