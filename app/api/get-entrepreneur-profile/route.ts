import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        entrepreneurProfile: {
          include: {
            pitches: true,
          },
        },
      },
    });

    if (!dbUser || !dbUser.entrepreneurProfile) {
      return NextResponse.json(
        { error: "Entrepreneur profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      profile: dbUser.entrepreneurProfile,
      pitches: dbUser.entrepreneurProfile.pitches,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
