import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 },
    );
  }

  try {
    const friends = await prisma.user.findMany({
      where: {
        NOT: {
          id: user.id,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
      },
    });
    return NextResponse.json(friends);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 },
    );
  }
}
