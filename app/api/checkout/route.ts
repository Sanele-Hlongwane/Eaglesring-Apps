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

  // Validate input
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
          investmentStrategy: '',
          linkedinUrl: '',
        },
      });
    }

    // Convert amount from cents to rands
    const amountInRands = amount / 100;

    // Check if the investment opportunity already exists by title, description, or entrepreneur profile
    let investmentOpportunity = await prisma.investmentOpportunity.findFirst({
      where: {
        entrepreneurProfileId: entrepreneurProfile.id,
        OR: [
          { title: pitchTitle },
          { description: `Investment opportunity for ${pitchTitle}` },
        ],
      },
    });

    // If no investment opportunity exists, create one
    if (!investmentOpportunity) {
      investmentOpportunity = await prisma.investmentOpportunity.create({
        data: {
          entrepreneurProfileId: entrepreneurProfile.id,
          title: pitchTitle,
          amount: amountInRands,
          description: `Investment opportunity for ${pitchTitle}`,
        },
      });
    }

    // Create a new Investment record
    const investment = await prisma.investment.create({
      data: {
        amount: amountInRands,
        title: pitchTitle,
        investorProfileId: investorProfile.id,
        entrepreneurProfileId: entrepreneurProfile.id,
        investmentOpportunityId: investmentOpportunity.id,
      },
    });

    // Search for an existing Stripe customer using email
    const email = user.primaryEmailAddress?.emailAddress || '';
    let customer = null;

    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1, // We only care if there's one customer with this email
    });

    if (existingCustomers.data.length > 0) {
      // If customer exists, update their details if necessary
      customer = existingCustomers.data[0];
    } else {
      // Otherwise, create a new customer
      customer = await stripe.customers.create({
        email: email,
        name: user.fullName || '',
        metadata: {
          clerkId: clerkId,
        },
      });

      // Store the Stripe customer ID in the database
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId: customer.id },
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
            unit_amount: amount,  // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/invested`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      customer: customer.id,  // Attach the customer to the session
      metadata: {
        pitchId: pitchId.toString(),
        pitchTitle: pitchTitle,
        userId: investorProfile.id.toString(),
        entrepreneurProfileId: entrepreneurProfile.id.toString(),
        investmentOpportunityId: investmentOpportunity.id.toString(),
        investmentId: investment.id.toString(),  // Include investment ID for reference
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
