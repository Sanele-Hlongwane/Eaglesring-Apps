import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  const { id } = context.params; // ✅ Correct access pattern for Next 15

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
      return NextResponse.json({ error: "Invalid sender ID" }, { status: 400 });
    }

    const friendRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: receiver.id,
          receiverId: senderId,
        },
      },
    });

    console.debug(`Receiver ID: ${receiver.id}, Sender ID: ${senderId}`);

    if (!friendRequest) {
      console.error("Friend request not found");
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 }
      );
    }

    await prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: receiver.id,
          receiverId: senderId,
        },
      },
    });

    console.debug(`Friend request with Sender ID ${senderId} deleted`);

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      console.error("Sender user not found");
      return NextResponse.json(
        { error: "Sender user not found" },
        { status: 404 }
      );
    }

    await prisma.notification.create({
      data: {
        content: `${receiver.name} has deleted your friend request. You can resend it if you wish.`,
        userId: senderId,
      },
    });

    console.debug(
      `Notification sent to Sender ID ${senderId}: "${receiver.name} has deleted your friend request. You can resend it if you wish."`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting friend request:", error);
    return NextResponse.json(
      {
        error: "Failed to delete friend request",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
