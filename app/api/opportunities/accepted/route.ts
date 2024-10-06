import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    console.error("No user found. Please log in.");
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 }
    );
  }

  try {
    console.log(`Current User Clerk ID: ${user.id}`);

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!dbUser) {
      console.error("No corresponding database user found.");
      return NextResponse.json(
        { error: "Database user not found." },
        { status: 404 }
      );
    }

    const userId = dbUser.id;
    console.log(`User ID for Query: ${userId}`);

    // Fetch accepted friend requests
    const acceptedRequests = await prisma.friendRequest.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          include: {
            entrepreneurProfile: true,
            investorProfile: true,
          },
        },
        receiver: {
          include: {
            entrepreneurProfile: true,
            investorProfile: true,
          },
        },
      },
    });

    console.debug(
      `Fetched ${acceptedRequests.length} accepted friend requests`
    );

    const response = [];

    for (const req of acceptedRequests) {
      const isSender = req.senderId === userId;
      const userData = isSender ? req.receiver : req.sender;

      // Check for existing conversation between the current user and the other user
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          participants: {
            some: {
              id: {
                in: [userId, userData.id], // Check for both participants
              },
            },
          },
        },
        include: {
          participants: true,
        },
      });

      if (!existingConversation) {
        // Create a new conversation if it does not exist
        const newConversation = await prisma.conversation.create({
          data: {
            participants: {
              connect: [
                { id: userId },
                { id: userData.id },
              ],
            },
          },
        });
        console.log(`New conversation created with ID: ${newConversation.id}`);
      } else {
        console.log(`Conversation already exists with ID: ${existingConversation.id}`);
      }

      response.push({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        imageUrl: userData.imageUrl,
        role: userData.role,
        entrepreneurProfile: userData.entrepreneurProfile,
        investorProfile: userData.investorProfile,
        status: req.status,
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch accepted requests" },
      { status: 500 }
    );
  }
}
