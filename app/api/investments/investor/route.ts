// src/app/api/investments/investor/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
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
      include: { investorProfile: true }, // Include the investor profile
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database." },
        { status: 404 }
      );
    }

    // Fetch investments where the current user is the investor
    const investments = await prisma.investment.findMany({
      where: {
        investorProfileId: dbUser.investorProfile?.id, // Ensure the user has an investor profile
      },
      include: {
        entrepreneurProfile: {
          select: {
            id: true,
            imageUrl: true,

            user: {
              select: {
                name: true,
              }
            }
          },
        },
        investmentOpportunity: {
          select: { id: true, title: true, description: true }, // Include investment opportunity details
        },
      },
      orderBy: {
        date: "desc", // Order investments by date, descending
      },
    });

    return NextResponse.json(investments);
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { error: "Unable to fetch investments." },
      { status: 500 }
    );
  }
}
