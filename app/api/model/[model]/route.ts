import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 },
    );
  }

  const model = request.nextUrl.searchParams.get("model"); // Model type: 'entrepreneurProfile' or 'investorProfile'
  const id = request.nextUrl.searchParams.get("id"); // Model ID

  if (!model || !id) {
    return NextResponse.json(
      { error: "Invalid request parameters" },
      { status: 400 },
    );
  }

  const data = await request.json();

  try {
    let updatedModel;

    switch (model) {
      case "entrepreneurProfile":
        updatedModel = await prisma.entrepreneurProfile.update({
          where: { id: Number(id) },
          data,
        });
        break;
      case "investorProfile":
        updatedModel = await prisma.investorProfile.update({
          where: { id: Number(id) },
          data,
        });
        break;
      default:
        return NextResponse.json(
          { error: "Model type not supported" },
          { status: 400 },
        );
    }

    return NextResponse.json(updatedModel);
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      { error: "Failed to update model" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 },
    );
  }

  const model = request.nextUrl.searchParams.get("model"); // Model type: 'entrepreneurProfile' or 'investorProfile'
  const id = request.nextUrl.searchParams.get("id"); // Model ID

  if (!model || !id) {
    return NextResponse.json(
      { error: "Invalid request parameters" },
      { status: 400 },
    );
  }

  try {
    switch (model) {
      case "entrepreneurProfile":
        await prisma.entrepreneurProfile.delete({
          where: { id: Number(id) },
        });
        break;
      case "investorProfile":
        await prisma.investorProfile.delete({
          where: { id: Number(id) },
        });
        break;
      default:
        return NextResponse.json(
          { error: "Model type not supported" },
          { status: 400 },
        );
    }

    return NextResponse.json({ message: "Model deleted successfully" });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json(
      { error: "Failed to delete model" },
      { status: 500 },
    );
  }
}
