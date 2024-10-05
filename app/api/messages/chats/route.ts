// src/app/api/messages/chats/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
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

    // Fetch messages where the user is either the sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: dbUser.id },
          { receiverId: dbUser.id },
        ],
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages." },
      { status: 500 }
    );
  }
}
