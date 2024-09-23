import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 },
    );
  }

  try {
    // Fetch the user's data including related profiles
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        entrepreneurProfile: {
          include: {
            pitches: true,
            investments: true,
          },
        },
        investorProfile: {
          include: {
            feedbacks: true,
            investments: true,
          },
        },
        feedbacks: true,
        interests: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    const analytics = {
      pitchesCount: existingUser.entrepreneurProfile?.pitches.length || 0,
      investmentsCount:
        existingUser.entrepreneurProfile?.investments.length || 0,
      feedbacksCount: existingUser.investorProfile?.feedbacks.length || 0,
      interestsCount: existingUser.interests.length || 0,
      pitches: existingUser.entrepreneurProfile?.pitches || [],
      investments: existingUser.entrepreneurProfile?.investments || [],
      feedbacks: existingUser.investorProfile?.feedbacks || [],
      interests: existingUser.interests || [],
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
