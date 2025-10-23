// src/app/api/investments/entrepreneur/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
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
      include: { entrepreneurProfile: true }, // Include the entrepreneur profile
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database." },
        { status: 404 },
      );
    }

    // Fetch investments where the current user is the entrepreneur
    const investments = await prisma.investment.findMany({
      where: {
        entrepreneurProfileId: dbUser.entrepreneurProfile?.id, // Ensure the user has an entrepreneur profile
      },
      include: {
        investorProfile: {
          select: {
            id: true,
            imageUrl: true, // Include imageUrl if needed
            user: {
              // Reference the User model to access name
              select: {
                name: true, // Select name from User
              },
            },
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
      { status: 500 },
    );
  }
}
