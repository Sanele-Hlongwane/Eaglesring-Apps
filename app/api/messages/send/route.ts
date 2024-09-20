import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { receiverId, content } = await req.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  try {
    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content,
        status: "SENT",
      },
    });
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
