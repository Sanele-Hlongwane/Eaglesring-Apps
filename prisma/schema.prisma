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
      { status: 401 },
    );
  }

  try {
    console.log(`Current User Clerk ID: ${user.id}`);

    // Use Clerk ID to find the corresponding User in the database
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id, // Map Clerk ID to your database User
      },
    });

    if (!dbUser) {
      console.error("No corresponding database user found.");
      return NextResponse.json(
        { error: "Database user not found." },
        { status: 404 },
      );
    }

    const userId = dbUser.id; // Use the numeric user ID from your database
    console.log(`User ID for Query: ${userId}`);

    // Fetch all friend requests where the current user is either the sender or the receiver
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    // Extract the user IDs of users for whom friend requests have been sent or received
    const excludedUserIds = friendRequests.flatMap((request) =>
      [request.senderId, request.receiverId].filter((id) => id !== userId),
    );

    console.log(
      "Users with sent or received friend requests:",
      excludedUserIds,
    );

    // Fetch all users except the current user and exclude users with existing friend requests
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId, // Exclude the current user's ID
          notIn: excludedUserIds, // Exclude users with existing friend requests
        },
      },
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
