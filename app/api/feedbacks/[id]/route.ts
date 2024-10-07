import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
    console.log("Received pitch id for submission:", params.id); // Log the pitch ID received

    const user = await currentUser();

    if (!user) {
        return NextResponse.json(
            { error: "User not authenticated." },
            { status: 401 }
        );
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
            select: { id: true }, // Only fetch user id
        });

        if (!dbUser) {
            return NextResponse.json(
                { error: "User not found in database." },
                { status: 404 }
            );
        }

        // Check if the pitchId is valid
        const pitchId = parseInt(params.id, 10);
        if (isNaN(pitchId) || pitchId <= 0) {
            console.error("Invalid pitch ID:", params.id);
            return NextResponse.json(
                { error: "Invalid pitch ID." },
                { status: 400 }
            );
        }

        // Parse request body
        const { content, expressInterest } = await request.json();

        // Create feedback
        if (content) {
            await prisma.feedback.create({
                data: {
                    content,
                    investorId: dbUser.id, // Assuming the user is an investor
                    pitchId: pitchId,
                },
            });
        }

        // Create interest if expressInterest is true
        if (expressInterest) {
            await prisma.interest.create({
                data: {
                    userId: dbUser.id, // Assuming the user is expressing interest
                    pitchId: pitchId,
                },
            });
        }

        return NextResponse.json(
            { message: "Feedback and interest submitted successfully." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting feedback or interest:", error);
        return NextResponse.json(
            { error: "Failed to submit feedback or interest." },
            { status: 500 }
        );
    }
}
