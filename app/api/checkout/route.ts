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
    const clerkId = user.id; // Get the clerkId

    // Fetch the user from the database using clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkId }, // Use Clerk ID
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database.' }, { status: 404 });
    }

    // Check if investor profile exists
    let investorProfile = await prisma.investorProfile.findUnique({
      where: { userId: dbUser.id }, // Ensure userId is a number
    });

    // If investor profile does not exist, create it
    if (!investorProfile) {
      investorProfile = await prisma.investorProfile.create({
        data: {
          userId: dbUser.id, // Ensure userId is a number
          investmentStrategy: '', // Set default or required fields as needed
          linkedinUrl: 'https://linkedin.com/in/your_profile',
          preferredIndustries: [],
          riskTolerance: '',
          investmentAmountRange: [],
        },
      });
    }

    // Create a new Checkout Session
   // Inside your existing POST request handler
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
    pitchId: pitchId, // Include pitch ID
    pitchTitle: pitchTitle, // Include pitch title
    userId: investorProfile.id.toString(), // Include investor profile ID as a string
  },
});


    // The investment creation should be handled after a successful payment (in your success handler)
    // If you want to save the investment immediately, you need to ensure payment confirmation first

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
