import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      console.error("User not authenticated");
      return NextResponse.json(
        {
          error: "User not authenticated",
        },
        { status: 401 },
      );
    }

    const clerkId = user.id;

    // Fetch the user from the database using clerkId
    const receiver = await prisma.user.findUnique({
      where: { clerkId: clerkId }, // Use Clerk ID
    });

    if (!receiver) {
      console.error("Receiver user not found");
      return NextResponse.json(
        {
          error: "Receiver user not found",
        },
        { status: 404 },
      );
    }

    // Debug logging
    console.debug(
      `Fetching received friend requests for user ID: ${receiver.id}`,
    );

    const receivedRequests = await prisma.friendRequest.findMany({
      where: { receiverId: receiver.id },
      include: {
        sender: {
          include: {
            entrepreneurProfile: true,
            investorProfile: true,
          },
        },
      },
    });

    console.debug(
      `Fetched ${receivedRequests.length} received friend requests`,
    );

    return NextResponse.json(
      receivedRequests.map((req) => ({
        id: req.sender.id,
        name: req.sender.name,
        email: req.sender.email,
        imageUrl: req.sender.imageUrl,
        role: req.sender.role,
        entrepreneurProfile: req.sender.entrepreneurProfile,
        investorProfile: req.sender.investorProfile,
        status: req.status,
      })),
    );
  } catch (error) {
    console.error("Failed to fetch received requests:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch received requests",
        details: (error as any).message,
      },
      { status: 500 },
    );
  }
}
