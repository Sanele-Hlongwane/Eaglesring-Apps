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
    // Fetch the user from the database to get their profile
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: {
        id: true,
        entrepreneurProfile: true, // Assuming 'entrepreneurProfile' is a relation field in your Prisma schema
      },
    });

    if (!existingUser || !existingUser.entrepreneurProfile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile: existingUser.entrepreneurProfile });
  } catch (error) {
    console.error("Error fetching entrepreneur profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch entrepreneur profile" },
      { status: 500 },
    );
  }
}
