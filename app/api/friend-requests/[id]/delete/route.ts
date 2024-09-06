import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser();

    if (!user) {
      console.error('User not authenticated');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const clerkId = user.id;

    // Fetch the receiver user from the database using clerkId
    const receiver = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!receiver) {
      console.error('Receiver user not found');
      return NextResponse.json({ error: 'Receiver user not found' }, { status: 404 });
    }

    const senderId = parseInt(params.id, 10); // Ensure senderId is a number

    // Fetch the friend request using both senderId and receiverId
    const friendRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: receiver.id,
          receiverId: senderId,
        },
      },
    });

    console.debug(`Receiver ID: ${receiver.id}, Sender ID: ${senderId}`);

    if (!friendRequest) {
      console.error('Friend request not found');
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
    }

    // Delete the friend request
    await prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: receiver.id,
          receiverId: senderId,
        },
      },
    });

    console.debug(`Friend request with Sender ID ${senderId} deleted`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting friend request:', error);
    return NextResponse.json({ error: 'Failed to delete friend request', details: (error as any).message }, { status: 500 });
  }
}
