import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// POST - Send a message
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      console.error("User not authenticated");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const { receiverId, content } = await request.json();

    // Validate receiverId and content
    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Receiver ID and content are required" },
        { status: 400 },
      );
    }

    // Step 1: Check if the users are blocked
    const isBlocked = await prisma.block.findFirst({
      where: {
        blockerId: parseInt(user.id, 10),
        blockedId: parseInt(receiverId, 10),
      },
    });

    if (isBlocked) {
      return NextResponse.json(
        { error: "You cannot send a message to this user." },
        { status: 403 },
      );
    }

    // Step 2: Check if the receiver has blocked the sender
    const isBlockedByReceiver = await prisma.block.findFirst({
      where: {
        blockerId: parseInt(receiverId, 10),
        blockedId: parseInt(user.id, 10),
      },
    });

    if (isBlockedByReceiver) {
      return NextResponse.json(
        { error: "This user has blocked you." },
        { status: 403 },
      );
    }

    // Step 3: Find the conversation with the participants
    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: {
            id: {
              in: [parseInt(user.id, 10), parseInt(receiverId, 10)],
            },
          },
        },
      },
    });

    // If conversation does not exist, create a new one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [
              { id: parseInt(user.id, 10) },
              { id: parseInt(receiverId, 10) },
            ],
          },
        },
      });
    }

    // Step 4: Use conversation ID to create message
    const newMessage = await prisma.message.create({
      data: {
        content,
        senderId: parseInt(user.id, 10),
        receiverId: parseInt(receiverId, 10),
        conversationId: conversation.id, // Link to the created or existing conversation
        status: "SENT",
      },
    });

    return NextResponse.json({ success: true, newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message", details: (error as any).message },
      { status: 500 },
    );
  }
}

// GET - Fetch messages for a specific conversation
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      console.error("User not authenticated");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Extract conversationId from the search parameters
    const conversationId = request.nextUrl.searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 },
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: parseInt(conversationId, 10),
      },
      orderBy: {
        sentAt: "asc", // Order messages by sent time
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
