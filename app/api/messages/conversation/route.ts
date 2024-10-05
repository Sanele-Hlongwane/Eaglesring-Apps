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
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database." },
        { status: 404 }
      );
    }

    // Parse the JSON body to get the conversation ID
    const { conversationId } = await request.json();

    // Check if conversationId is a valid number
    if (!conversationId || isNaN(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation ID." },
        { status: 400 }
      );
    }

    // Fetch messages for a specific conversation
    const messages = await prisma.message.findMany({
      where: {
        conversationId: Number(conversationId), // Ensure it's a number
      },
      orderBy: {
        sentAt: 'asc', // Optional: Order messages by sentAt field
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation." },
      { status: 500 }
    );
  }
}
