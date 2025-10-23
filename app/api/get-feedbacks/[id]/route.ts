import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context : any,
) {
  console.log("Received pitch id:", context.id); // Log the pitch ID received

  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated." },
      { status: 401 },
    );
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true }, // Only fetch user id
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database." },
        { status: 404 },
      );
    }

    // Check if the pitchId is valid
    const pitchId = parseInt(context.id, 10);
    if (isNaN(pitchId) || pitchId <= 0) {
      console.error("Invalid pitch ID:", context.id);
      return NextResponse.json({ error: "Invalid pitch ID." }, { status: 400 });
    }

    // Fetch feedback associated with the specified pitch ID
    const feedbacks = await prisma.feedback.findMany({
      where: {
        pitchId: pitchId, // Use pitchId to filter feedback
      },
      include: {
        investor: {
          select: {
            id: true,
            user: {
              // Access the User relation
              select: {
                name: true, // Select the name from User
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Fetch interests associated with the specified pitch ID
    const interests = await prisma.interest.findMany({
      where: {
        pitchId: pitchId, // Use pitchId to filter interests
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      feedbacks,
      interests,
    });
  } catch (error) {
    console.error("Error fetching feedback and interests:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback and interests." },
      { status: 500 },
    );
  }
}
