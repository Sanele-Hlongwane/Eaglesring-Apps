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
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    // Return user data including the imageUrl and funding history
    const { imageUrl } = existingUser;
    const { fundingHistory } = existingUser.entrepreneurProfile || {};

    return NextResponse.json({
      imageUrl,
      fundingHistory: fundingHistory || "No funding history available",
      entrepreneurProfile: existingUser.entrepreneurProfile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
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

  const {
    bio,
    company,
    businessStage,
    linkedinUrl,
    revenue,
    imageUrl, // This will handle the image upload
  } = await request.json();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id, role: "ENTREPRENEUR" },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    // Update entrepreneur profile and imageUrl in the User model
    let entrepreneurProfile = await prisma.entrepreneurProfile.findUnique({
      where: { userId: existingUser.id },
    });

    if (!entrepreneurProfile) {
      entrepreneurProfile = await prisma.entrepreneurProfile.create({
        data: {
          userId: existingUser.id,
          bio,
          company,
          businessStage,
          linkedinUrl,
          revenue,
          imageUrl,
        },
      });
    } else {
      // Update entrepreneur profile
      await prisma.entrepreneurProfile.update({
        where: { userId: existingUser.id },
        data: { bio, company, businessStage, linkedinUrl, revenue, imageUrl },
      });
    }

    // Update the imageUrl
    if (imageUrl) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { imageUrl },
      });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      entrepreneurProfile,
      imageUrl: existingUser.imageUrl,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
