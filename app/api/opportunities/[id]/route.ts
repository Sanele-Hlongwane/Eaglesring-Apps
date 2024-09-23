import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10); // Parse the user ID

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
  }

  try {
    // Fetch entrepreneur's profile and pitches by using userId from EntrepreneurProfile model
    const entrepreneurProfile = await prisma.entrepreneurProfile.findUnique({
      where: {
        userId: id, // Use userId to find the entrepreneur profile
      },
      include: {
        pitches: true, // Include the pitches related to the entrepreneur profile
      },
    });

    if (!entrepreneurProfile) {
      return NextResponse.json(
        { message: "Entrepreneur profile not found." },
        { status: 404 },
      );
    }

    // Return both entrepreneur profile and pitches
    return NextResponse.json({
      entrepreneur: entrepreneurProfile,
      pitches: entrepreneurProfile.pitches,
    });
  } catch (error) {
    console.error("Error fetching entrepreneur profile and pitches:", error);
    return NextResponse.json(
      { error: "Failed to fetch entrepreneur profile and pitches." },
      { status: 500 },
    );
  }
}
