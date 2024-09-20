import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { id, status } = await req.json();

  try {
    const message = await prisma.message.update({
      where: { id: Number(id) },
      data: {
        status,
        receivedAt: status === "RECEIVED" ? new Date() : undefined,
        readAt: status === "READ" ? new Date() : undefined,
      },
    });
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message status" }, { status: 500 });
  }
}
