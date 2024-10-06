import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log("Received parameters:", params); // Log the params
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
    const formattedConversations = conversations.map(conversation => {
      // Find the current user index
      const userIndex = conversation.participants.findIndex(p => p.id === dbUser.id);
      
      // Reorder participants: if the user is found, rearrange
      const participants = [...conversation.participants];

      if (userIndex !== -1) {
        // Remove the user from their current position and insert them at index 1
        const [currentUser] = participants.splice(userIndex, 1);
        participants.splice(1, 0, currentUser);
      }

      return {
        id: conversation.id,
        latestMessage: conversation.messages[0] || null, // Latest message or null if none
        participants, // Rearranged participants
      };
    });

    // Fetch messages where the user is either the sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: dbUser.id },
          { receiverId: dbUser.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc', // Order messages by sentAt in descending order
      },
    });

    // Return both conversations and messages
    return NextResponse.json({
      userName: dbUser.name,
      conversations: formattedConversations,
      messages,
    });
  } catch (error) {
    console.error("Error fetching conversations and messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations and messages." },
      { status: 500 }
    );
  }
}
