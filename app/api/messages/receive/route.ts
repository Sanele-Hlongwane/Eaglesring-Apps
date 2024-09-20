import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        receiverId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve messages" }, { status: 500 });
  }
}
