import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 }
    );
  }

  try {
    // Use user.id directly as it should be a string
    const clerkId = user.id;

    const friends = await prisma.user.findMany({
      where: {
        NOT: {
          clerkId: clerkId,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error); // Added logging for debugging
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}
