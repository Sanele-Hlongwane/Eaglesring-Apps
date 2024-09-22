import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser();

    if (!user) {
      console.error('User not authenticated');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const clerkId = user.id;

    // Fetch the user from the database using clerkId
    const receiver = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!receiver) {
      console.error('Receiver user not found');
      return NextResponse.json({ error: 'Receiver user not found' }, { status: 404 });
    }

    const senderId = parseInt(params.id);

    // Fetch the friend request using both senderId and receiverId
    const friendRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: senderId,
          receiverId: receiver.id,
        },
      },
    });

    console.debug(`Receiver ID: ${receiver.id}, Sender ID: ${senderId}`);

    if (!friendRequest) {
      console.error('Friend request not found');
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
    }

    // Update the status of the friend request to 'ACCEPTED'
    const updatedFriendRequest = await prisma.friendRequest.update({
      where: {
        senderId_receiverId: {
          senderId: senderId,
          receiverId: receiver.id,
        },
      },
      data: { status: 'ACCEPTED' },
    });

    // Fetch the sender details
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      console.error('Sender user not found');
      return NextResponse.json({ error: 'Sender user not found' }, { status: 404 });
    }

    // Create a notification for the sender, notifying them that their friend request was accepted
    await prisma.notification.create({
      data: {
        content: `${receiver.name} has accepted your friend request. You can now send messages.`,
        userId: senderId, // This sends the notification to the sender
      },
    });

    console.debug(`Notification sent to Sender ID ${senderId}: "${receiver.name} has accepted your friend request"`);

    return NextResponse.json({ success: true, updatedFriendRequest });

  } catch (error) {
    console.error('Error accepting friend request:', error);
    return NextResponse.json({ error: 'Failed to accept friend request', details: (error as any).message }, { status: 500 });
  }
}
