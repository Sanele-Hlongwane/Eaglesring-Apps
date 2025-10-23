import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  console.log("Received pitch id for submission:", id);

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
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database." },
        { status: 404 }
      );
    }

    const pitchId = parseInt(id, 10);
    if (isNaN(pitchId) || pitchId <= 0) {
      console.error("Invalid pitch ID:", id);
      return NextResponse.json(
        { error: "Invalid pitch ID." },
        { status: 400 }
      );
    }

    const { content, expressInterest } = await request.json();

    if (content) {
      await prisma.feedback.create({
        data: {
          content,
          investorId: dbUser.id,
          pitchId,
        },
      });
    }

    if (expressInterest) {
      await prisma.interest.create({
        data: {
          userId: dbUser.id,
          pitchId,
        },
      });
    }

    return NextResponse.json(
      { message: "Feedback and interest submitted successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting feedback or interest:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback or interest." },
      { status: 500 }
    );
  }
}
