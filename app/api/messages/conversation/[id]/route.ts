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

      // Extract conversationId from query parameters
      const url = new URL(request.url);
      const conversationIdString = url.searchParams.get("conversationId");
      const conversationId = Number(conversationIdString); // Convert it to a number

      // Check if conversationId is a valid number
      if (isNaN(conversationId)) {
          return NextResponse.json(
              { error: "Invalid conversation ID." },
              { status: 400 }
          );
      }

      console.log("Fetching messages for conversation ID:", conversationId);

      const messages = await prisma.message.findMany({
          where: {
              conversationId: conversationId,
          },
          orderBy: {
              sentAt: 'asc',
          },
          include: {
              sender: {
                  select: {
                      id: true,
                      name: true,
                      imageUrl: true,
                  },
              },
              receiver: {
                  select: {
                      id: true,
                      name: true,
                      imageUrl: true,
                  },
              },
          },
      });

      console.log("Fetched messages:", messages.length, messages);

      return NextResponse.json(messages);
  } catch (error) {
      console.error("Error fetching messages:", error);
      return NextResponse.json(
          { error: "Failed to fetch messages." },
          { status: 500 }
      );
  }
}
