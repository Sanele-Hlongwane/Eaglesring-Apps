import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      console.log("User not authenticated");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Fetch the user from the database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
        notifications: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        investments: true,
      },
    });

    if (!dbUser) {
      console.log("User not found in database");
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(dbUser, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
