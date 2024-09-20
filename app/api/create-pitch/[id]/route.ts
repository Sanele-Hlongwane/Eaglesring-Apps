import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Pitch ID is missing or invalid" }, { status: 400 });
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  try {
    const pitch = await prisma.pitch.findUnique({
      where: { id: Number(id) },
    });

    if (!pitch) {
      return NextResponse.json({ error: "Pitch not found" }, { status: 404 });
    }

    return NextResponse.json(pitch);
  } catch (error) {
    console.error('Error fetching pitch:', error);
    return NextResponse.json({ error: "Failed to fetch pitch" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Pitch ID is missing or invalid" }, { status: 400 });
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  try {
    const { title, description, fundingGoal } = await req.json();

    if (!title || !description || !fundingGoal) {
      return NextResponse.json(
        { error: "Title, description, and funding goal are required" },
        { status: 400 }
      );
    }

    const pitch = await prisma.pitch.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        fundingGoal: parseFloat(fundingGoal), // Ensure it's a number
      },
    });

    return NextResponse.json(pitch);
  } catch (error) {
    console.error('Error updating pitch:', error);
    return NextResponse.json({ error: "Failed to update pitch" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Pitch ID is missing or invalid" }, { status: 400 });
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  try {
    await prisma.pitch.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Pitch deleted successfully" });
  } catch (error) {
    console.error('Error deleting pitch:', error);
    return NextResponse.json({ error: "Failed to delete pitch" }, { status: 500 });
  }
}