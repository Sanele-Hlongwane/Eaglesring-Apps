import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const prisma = new PrismaClient();

// Function to send confirmation email
async function sendConfirmationEmail(customerEmail: string, investmentAmount: number, pitchTitle: string) {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: customerEmail,
    from: 'sanelehlongwane61@gmail.com',
    subject: 'Investment Confirmation',
    text: `You have successfully invested ZAR ${investmentAmount} in ${pitchTitle}.`,
    html: `<strong>Thank you for your investment of ZAR ${investmentAmount} in ${pitchTitle}!</strong>`,
  };

  try {
    await sgMail.send(msg);
    console.log('Confirmation email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

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

    // Fetch user from the database using clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database.' }, { status: 404 });
    }

    // Check if the investor profile exists or create one
    let investorProfile = await prisma.investorProfile.findUnique({
      where: { userId: dbUser.id },
    });

    if (!investorProfile) {
      investorProfile = await prisma.investorProfile.create({
        data: {
          userId: dbUser.id,
          investmentStrategy: '',
          linkedinUrl: 'https://linkedin.com/in/your_profile',
          preferredIndustries: [],
          riskTolerance: '',
          investmentAmountRange: [],
        },
      });
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

    // Ensure the investment opportunity exists, or create one
    let investmentOpportunity = pitch.investmentOpportunity;
    if (!investmentOpportunity) {
      investmentOpportunity = await prisma.investmentOpportunity.create({
        data: {
          entrepreneurProfileId: entrepreneurProfile.id,
          title: pitchTitle,
          amount: 0, // Adjusted based on actual investments
          description: `Investment opportunity for ${pitchTitle}`,
        },
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'zar',
            product_data: { name: `Pitch: ${pitchTitle}` },
            unit_amount: amount * 100, // Convert to cents
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

// Webhook to handle successful payment
export async function webhookHandler(request: Request) {
  const sig = request.headers.get('stripe-signature')!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract and assert necessary metadata
    const {
      pitchId,
      pitchTitle,
      userId,
      entrepreneurProfileId,
      investmentOpportunityId,
    } = session.metadata as { 
      pitchId: string; 
      pitchTitle: string; 
      userId: string; 
      entrepreneurProfileId: string; 
      investmentOpportunityId: string 
    };

    try {
      // Create the investment record
      await prisma.investment.create({
        data: {
          amount: session.amount_total! / 100, // Convert from cents to ZAR
          title: `Investment in ${pitchTitle}`,
          investorProfileId: parseInt(userId),
          entrepreneurProfileId: parseInt(entrepreneurProfileId),
          investmentOpportunityId: parseInt(investmentOpportunityId),
        },
      });

      // Send confirmation email
      await sendConfirmationEmail(session.customer_email!, session.amount_total! / 100, pitchTitle);
      
      console.log('Investment and email processed successfully');
    } catch (error) {
      console.error('Error processing investment:', error);
    }
  }

  return NextResponse.json({ received: true });
}
