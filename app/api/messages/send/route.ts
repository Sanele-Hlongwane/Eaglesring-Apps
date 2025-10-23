import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import sgMail from "@sendgrid/mail";

const prisma = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated." },
      { status: 401 },
    );
  }

  try {
    const { receiverId, content } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Invalid input data." },
        { status: 400 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database." },
        { status: 404 },
      );
    }

    // Check if both users are participants in the same conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: { id: { in: [dbUser.id, receiverId] } }, // Check for both users
        },
      },
      include: {
        participants: true, // Include participants to get their data
      },
    });

    // If no conversation exists, create one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [{ id: dbUser.id }, { id: receiverId }],
          },
        },
        include: {
          participants: true, // Include participants to return their data
        },
      });
    }

    // Create the message with the conversation ID
    const message = await prisma.message.create({
      data: {
        content,
        senderId: dbUser.id,
        receiverId,
        conversationId: conversation.id, // Ensure conversation.id is valid
      },
    });

    // Create a notification for the receiver
    await prisma.notification.create({
      data: {
        content: `New message from ${dbUser.name}: ${content}`,
        userId: receiverId,
        status: "ENABLED",
      },
    });

    // Get the receiver's email to send the email notification
    const receiverUser = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { email: true, name: true },
    });

    if (receiverUser && receiverUser.email) {
      const msg = {
        to: receiverUser.email,
        from: "sanelehlongwane61@gmail.com",
        subject: `New message from ${dbUser.name}`,
        text: content,
        html: `<p>You have a new message from ${dbUser.name}:</p><p>${content}</p>`,
      };

      await sgMail.send(msg);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Unable to send message." },
      { status: 500 },
    );
  }
}
