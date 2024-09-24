import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const sig = request.headers.get('Stripe-Signature') || '';
  const body = await request.json();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const amount_total = session.amount_total; // This can be number | null
    const sessionId = session.id; // Unique identifier for the checkout session
    const customer_email = session.customer_email; // Customer's email (optional)

    const pitchId = session.metadata?.pitchId;
    const pitchTitle = session.metadata?.pitchTitle;
    const userId = session.metadata?.userId;

    // Ensure required metadata is present
    if (!pitchId || !pitchTitle || !userId) {
      console.error('Missing required metadata:', {
        pitchId,
        pitchTitle,
        userId,
      });
      return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 });
    }

    // Ensure amount_total is not null
    if (amount_total === null) {
      console.error('Amount total is null');
      return NextResponse.json({ error: 'Amount total is required' }, { status: 400 });
    }

    try {
      // Fetch the pitch to get the entrepreneur's profile ID
      const pitch = await prisma.pitch.findUnique({
        where: { id: parseInt(pitchId, 10) },
        select: { entrepreneurId: true },
      });

      if (!pitch) {
        console.error('Pitch not found:', pitchId);
        return NextResponse.json({ error: 'Pitch not found' }, { status: 404 });
      }

      // Convert values to number
      const investmentAmount = amount_total / 100; // Convert from cents to your currency unit
      const parsedUserId = parseInt(userId, 10);
      const parsedEntrepreneurId = pitch.entrepreneurId;

      if (isNaN(investmentAmount) || isNaN(parsedUserId) || !parsedEntrepreneurId) {
        console.error('Invalid investment data:', {
          investmentAmount,
          userId,
          entrepreneurId: parsedEntrepreneurId,
        });
        return NextResponse.json({ error: 'Invalid investment data' }, { status: 400 });
      }

      await prisma.investment.create({
        data: {
          amount: investmentAmount,
          title: pitchTitle,
          investorProfileId: parsedUserId,
          entrepreneurProfileId: parsedEntrepreneurId,
          investmentOpportunityId: parseInt(pitchId, 10),
        },
      });
    } catch (error) {
      console.error('Error creating investment:', error);
      return NextResponse.json({ error: 'Failed to create investment' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
