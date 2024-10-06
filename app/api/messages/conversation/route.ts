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
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true, name: true }, // Fetch user id and name
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database." },
        { status: 404 }
      );
    }

    // Fetch all conversations for the user
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: dbUser.id }, // Only fetch conversations where the user is a participant
        },
      },
      include: {
        messages: {
          orderBy: {
            sentAt: 'desc', // Get messages ordered by sentAt in descending order
          },
          take: 1, // Only get the latest message
          include: {
            sender: {
              select: {
                id: true, // Include the sender's id
                name: true, // Include the sender's name
              },
            },
            receiver: {
              select: {
                id: true, // Include the receiver's id
                name: true, // Include the receiver's name
              },
            },
          },
        },
        participants: { // Include participant ids and names
          select: {
            id: true, // Include participant id
            name: true, // Include participant name
          },
        },
      },
    });

    // Map the conversations to include the latest message and the user's name
    const formattedConversations = conversations.map(conversation => ({
      conversationId: conversation.id,
      latestMessage: conversation.messages[0] || null, // Latest message or null if none
      participants: conversation.participants, // Include participants info
    }));

    return NextResponse.json({ userName: dbUser.name, conversations: formattedConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations." },
      { status: 500 }
    );
  }
}
