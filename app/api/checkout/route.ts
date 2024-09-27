import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
  }

  const { pitchId, amount, pitchTitle } = await request.json();

  if (!pitchId || !amount) {
    return NextResponse.json({ error: 'Pitch ID and amount are required' }, { status: 400 });
  }

  try {
    const clerkId = user.id;

    // Fetch the user from the database using clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database.' }, { status: 404 });
    }

    // Fetch the pitch and its entrepreneur profile
    const pitch = await prisma.pitch.findUnique({
      where: { id: pitchId },
      include: { entrepreneur: true, investmentOpportunity: true },
    });

    if (!pitch) {
      return NextResponse.json({ error: 'Pitch not found.' }, { status: 404 });
    }

    const entrepreneurProfile = pitch.entrepreneur;

    // Fetch or create the investor profile
    let investorProfile = await prisma.investorProfile.findUnique({
      where: { userId: dbUser.id },
    });

    if (!investorProfile) {
      // Create a new investor profile if it doesn't exist
      investorProfile = await prisma.investorProfile.create({
        data: {
          userId: dbUser.id,
          investmentStrategy: 'default strategy', // Optional: Adjust default data
          linkedinUrl: '',                        // Optional: Adjust default data
        },
      });
    }

    // Ensure the investment opportunity exists or create one
    let investmentOpportunity = pitch.investmentOpportunity;
    if (!investmentOpportunity) {
      investmentOpportunity = await prisma.investmentOpportunity.create({
        data: {
          entrepreneurProfileId: entrepreneurProfile.id,
          title: pitchTitle,
          amount: 0,
          description: `Investment opportunity for ${pitchTitle}`,
        },
      });
    }

    // Create a new Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'zar',
            product_data: {
              name: `Pitch: ${pitchTitle}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/invested`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      customer_email: user.primaryEmailAddress?.emailAddress || '',
      metadata: {
        pitchId: pitchId.toString(),
        pitchTitle: pitchTitle,
        userId: investorProfile.id.toString(),
        entrepreneurProfileId: entrepreneurProfile.id.toString(),
        investmentOpportunityId: investmentOpportunity.id.toString(),
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
