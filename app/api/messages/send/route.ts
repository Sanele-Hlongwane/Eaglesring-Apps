import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated." },
      { status: 401 }
    );
  }

  try {
    const { receiverId, content } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Invalid input data." },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database." },
        { status: 404 }
      );
    }

    // Check for an existing conversation with either participant
    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: {
            id: { in: [dbUser.id, receiverId] },
          },
        },
      },
      include: {
        participants: true, // Include participants to get their data
      },
    });

    // If no conversation exists, create one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [
              { id: dbUser.id },
              { id: receiverId },
            ],
          },
        },
        include: {
          participants: true, // Include participants to return their data
        },
      });
    }

    // Create the message with the conversation ID
    const message = await prisma.message.create({
      data: {
        content,
        senderId: dbUser.id,
        receiverId,
        conversationId: conversation.id, // Ensure conversation.id is valid
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Unable to send message." },
      { status: 500 }
    );
  }
}
