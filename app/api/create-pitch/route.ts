import { NextRequest, NextResponse } from "next/server";
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

    const pitches = existingUser.entrepreneurProfile?.pitches || [];

    return NextResponse.json({ pitches });
  } catch (error) {
    console.error("Error fetching pitches:", error);
    return NextResponse.json(
      { error: "Failed to fetch pitches" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 },
    );
  }

  const { title, description, videoUrl, attachments, fundingGoal } =
    await request.json();

  if (!title || !description) {
    return NextResponse.json(
      { error: "Title and description are required" },
      { status: 400 },
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    let entrepreneurProfile = await prisma.entrepreneurProfile.findUnique({
      where: { userId: existingUser.id },
    });

    if (!entrepreneurProfile) {
      entrepreneurProfile = await prisma.entrepreneurProfile.create({
        data: {
          userId: existingUser.id,
          bio: "Hey there, I am new entrepreneur here to get funds for my company.", // Placeholder bio for now
        },
      });
    }

    const newPitch = await prisma.pitch.create({
      data: {
        title,
        description,
        videoUrl,
        attachments,
        fundingGoal,
        entrepreneurId: entrepreneurProfile.id,
      },
    });

    return NextResponse.json({
      message: "Pitch created successfully",
      pitch: newPitch,
    });
  } catch (error) {
    console.error("Error creating pitch:", error);
    return NextResponse.json(
      { error: "Failed to create pitch" },
      { status: 500 },
    );
  }
}
