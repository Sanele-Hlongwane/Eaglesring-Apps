import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  const user = await currentUser();

  if (!user) {
    console.log("User not logged in");
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 }
    );
  }

  console.log("Current user ID:", user.id);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        investorProfile: {
          include: {
            feedbacks: true,
            investments: true,
          },
        },
      },
    });

    if (!existingUser) {
      console.log("User not found in database with clerkId:", user.id);
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    if (!existingUser.investorProfile) {
      console.log("Investor profile not found for user ID:", existingUser.id);
      return NextResponse.json(
        { error: "Investor profile not found" },
        { status: 404 }
      );
    }

    console.log("Investor profile fetched successfully for user ID:", existingUser.id);
    return NextResponse.json(existingUser.investorProfile);
  } catch (error) {
    console.error("Error fetching investor profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch investor profile" },
      { status: 500 }
    );
  }
}

// POST request to update editable fields of the investor profile
export async function POST(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    console.log("User not logged in");
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 }
    );
  }

  console.log("Current user ID:", user.id);

  const {
    bio,
    imageUrl,
    investmentStrategy,
    linkedinUrl,
    preferredIndustries,
    riskTolerance,
    investmentAmountRange,
  } = await request.json();

  console.log("Received data:", {
    bio,
    imageUrl,
    investmentStrategy,
    linkedinUrl,
    preferredIndustries,
    riskTolerance,
    investmentAmountRange,
  });

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        investorProfile: true,
      },
    });

    if (!existingUser) {
      console.log("User profile not found with clerkId:", user.id);
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    console.log("Found existing user:", existingUser);

    let investorProfile = await prisma.investorProfile.findUnique({
      where: { userId: existingUser.id },
    });

    if (!investorProfile) {
      console.log("No investor profile found. Creating new profile.");
      investorProfile = await prisma.investorProfile.create({
        data: {
          userId: existingUser.id,
          bio,
          imageUrl,
          investmentStrategy,
          linkedinUrl,
          preferredIndustries,
          riskTolerance,
          investmentAmountRange,
        },
      });
    } else {
      console.log("Investor profile found. Updating profile.");
      investorProfile = await prisma.investorProfile.update({
        where: { userId: existingUser.id },
        data: {
          bio,
          imageUrl,
          investmentStrategy,
          linkedinUrl,
          preferredIndustries,
          riskTolerance,
          investmentAmountRange,
        },
      });
    }

    console.log("Investor profile updated successfully for user ID:", existingUser.id);
    return NextResponse.json({
      message: "Investor profile updated successfully",
      investorProfile,
    });
  } catch (error) {
    console.error("Error updating investor profile:", error);
    return NextResponse.json(
      { error: "Failed to update investor profile" },
      { status: 500 }
    );
  }
}
