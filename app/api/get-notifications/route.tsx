import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get the current authenticated user from Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const clerkId = user.id;

    // Fetch the user from the database using clerkId
    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    // Get query parameters for search and filters
    const urlParams = request.nextUrl.searchParams;
    const search = urlParams.get("search"); // Get 'search' parameter from the query
    const startDate = urlParams.get("startDate"); // Get 'startDate' parameter from the query
    const endDate = urlParams.get("endDate"); // Get 'endDate' parameter from the query

    // Construct filters based on query params
    let filters: any = {
      userId: existingUser.id,
    };

    // Search by notification content
    if (search) {
      filters.content = {
        contains: search, // This allows case-insensitive partial matching
        mode: "insensitive",
      };
    }

    // Filter by date range
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        filters.createdAt.lte = new Date(endDate);
      }
    }

    // Fetch notifications with the applied filters
    const notifications = await prisma.notification.findMany({
      where: filters,
      orderBy: {
        createdAt: "desc", // Optional: order notifications by creation date
      },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
