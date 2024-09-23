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

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!dbUser) {
      console.error("No corresponding database user found.");
      return NextResponse.json(
        { error: "Database user not found." },
        { status: 404 },
      );
    }

    const userId = dbUser.id;
    console.log(`User ID for Query: ${userId}`);

    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    const excludedUserIds = friendRequests.flatMap((request) =>
      [request.senderId, request.receiverId].filter((id) => id !== userId),
    );

    console.log(
      "Users with sent or received friend requests:",
      excludedUserIds,
    );

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
          notIn: excludedUserIds,
        },
        role: "ENTREPRENEUR",
        entrepreneurProfile: {
          isNot: null,
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
