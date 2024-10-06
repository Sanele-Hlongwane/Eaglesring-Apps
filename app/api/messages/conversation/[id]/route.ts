import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    console.log("Received id:", params.id); // Log the conversation ID received

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

        const conversationId = parseInt(params.id, 10);
        console.log("Fetching messages for conversation ID:", conversationId);

        // Check if conversationId is a valid number
        if (isNaN(conversationId) || conversationId <= 0) {
            console.error("Invalid conversation ID:", params.id);
            return NextResponse.json(
                { error: "Invalid conversation ID." },
                { status: 400 }
            );
        }

        // Fetch messages for the specified conversation ID
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId, // Use conversationId to filter messages
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true
                    },
                },
            },
            orderBy: {
                sentAt: "asc"
            }
        });

        console.log(messages); // Log the fetched messages
        return NextResponse.json( messages);   
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages." },
            { status: 500 }
        );
    }
}
