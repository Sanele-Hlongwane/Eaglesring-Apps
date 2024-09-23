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
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: {
        investorProfile: true,
        investments: true,
        feedbacks: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(existingUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch investor dashboard data" },
      { status: 500 },
    );
  }
}
