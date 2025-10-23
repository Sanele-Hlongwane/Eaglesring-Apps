import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// POST - Block a user
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      console.error("User not authenticated");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const { blockedId } = await request.json();

    if (!blockedId) {
      return NextResponse.json(
        { error: "Blocked user ID is required" },
        { status: 400 },
      );
    }

    const block = await prisma.block.create({
      data: {
        blockerId: parseInt(user.id, 10),
        blockedId: parseInt(blockedId, 10),
      },
    });

    return NextResponse.json({ success: true, block });
  } catch (error) {
    console.error("Error blocking user:", error);
    return NextResponse.json(
      { error: "Failed to block user", details: (error as any).message },
      { status: 500 },
    );
  }
}

// DELETE - Unblock a user
export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      console.error("User not authenticated");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const { blockedId } = await request.json();

    if (!blockedId) {
      return NextResponse.json(
        { error: "Blocked user ID is required" },
        { status: 400 },
      );
    }

    await prisma.block.delete({
      where: {
        blockerId_blockedId: {
          blockerId: parseInt(user.id, 10),
          blockedId: parseInt(blockedId, 10),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unblocking user:", error);
    return NextResponse.json(
      { error: "Failed to unblock user", details: (error as any).message },
      { status: 500 },
    );
  }
}
