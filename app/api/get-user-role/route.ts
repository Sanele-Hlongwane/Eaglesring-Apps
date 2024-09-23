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
    // Fetch the user from the database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { role: true },
    });

    if (!existingUser || !existingUser.role) {
      return NextResponse.json({ role: null });
    }

    return NextResponse.json({ role: existingUser.role });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user role" },
      { status: 500 },
    );
  }
}
