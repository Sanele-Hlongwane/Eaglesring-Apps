// src/app/api/messages/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma'; // Adjust the path as needed
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.error();

  const { content, receiverId } = await request.json();

  if (!content || !receiverId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

  const message = await db.message.create({
    data: {
      content,
      senderId: user.id,
      receiverId,
    },
  });

  return NextResponse.json(message);
}

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.error();

  const url = new URL(request.url);
  const { otherUserId } = url.searchParams;

  if (!otherUserId) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

  const messages = await db.message.findMany({
    where: {
      OR: [
        { senderId: user.id, receiverId: parseInt(otherUserId, 10) },
        { senderId: parseInt(otherUserId, 10), receiverId: user.id },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(messages);
}
