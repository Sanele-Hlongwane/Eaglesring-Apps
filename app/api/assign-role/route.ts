import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 },
    );
  }

  const { role } = await request.json();

  if (!role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  try {
    // Check if the user already exists in the database
    let existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    // If the user doesn't exist, create a new one
    if (!existingUser) {
      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || "",
          imageUrl: user.imageUrl || "",
          role,
        },
      });
    } else if (!existingUser.role) {
      // If user exists and has no role assigned, update the role
      await prisma.user.update({
        where: { clerkId: user.id },
        data: {
          role,
        },
      });
    } else {
      // If the user already has a role assigned, prevent changing
      return NextResponse.json(
        { error: "Role has already been assigned and cannot be changed" },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: `Role ${role} assigned` });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to assign role" },
      { status: 500 },
    );
  }
}
