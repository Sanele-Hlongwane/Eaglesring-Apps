import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      console.log('User not authenticated');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { receiverId } = await request.json();
    console.log('Received data:', { receiverId });

    // Fetch the sender user from the database using clerkId
    const sender = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!sender) {
      console.log('Sender user not found');
      return NextResponse.json({ error: 'Sender user not found' }, { status: 404 });
    }

    // Validate receiverId format
    const receiverIdNumber = typeof receiverId === 'string' ? parseInt(receiverId, 10) : receiverId;

    if (isNaN(receiverIdNumber)) {
      console.log('Invalid receiverId format');
      return NextResponse.json({ error: 'Invalid receiverId format' }, { status: 400 });
    }

    // Check if the receiver exists in the database
    const receiver = await prisma.user.findUnique({
      where: { id: receiverIdNumber },
    });

    if (!receiver) {
      console.log('Receiver user not found');
      return NextResponse.json({ error: 'Receiver user not found' }, { status: 404 });
    }

    // Save the friend request in the database
    await prisma.friendRequest.create({
      data: {
        senderId: sender.id, // Use Prisma ID
        receiverId: receiver.id,
      },
    });

    return NextResponse.json({ message: 'Friend request sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json({ error: 'Failed to send friend request' }, { status: 500 });
  }
}