import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { currentUser } from '@clerk/nextjs/server'; // Import currentUser from Clerk

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const prisma = new PrismaClient();

async function sendConfirmationEmail(customerEmail: string, investmentAmount: number, pitchTitle: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: 'Investment Confirmation',
    text: `Thank you for your investment of ${investmentAmount} in "${pitchTitle}". We appreciate your support!`,
  };

  await transporter.sendMail(mailOptions);
}

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

    const amount_total = session.amount_total;
    if (amount_total === null) {
      console.error('Amount total is null');
      return NextResponse.json({ error: 'Amount total is required' }, { status: 400 });
    }

    const pitchId = session.metadata?.pitchId;
    const pitchTitle = session.metadata?.pitchTitle;
    const userId = session.metadata?.userId; // This is the userId from your metadata
    const investmentAmount = amount_total / 100;

    if (!pitchId || !pitchTitle || !userId) {
      console.error('Missing required metadata:', { pitchId, pitchTitle, userId });
      return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 });
    }

    try {
      const pitch = await prisma.pitch.findUnique({
        where: { id: parseInt(pitchId, 10) },
        select: { entrepreneurId: true },
      });

      if (!pitch) {
        console.error('Pitch not found:', pitchId);
        return NextResponse.json({ error: 'Pitch not found' }, { status: 404 });
      }

      const parsedUserId = parseInt(userId, 10);
      const parsedEntrepreneurId = pitch.entrepreneurId;

      if (isNaN(investmentAmount) || isNaN(parsedUserId) || !parsedEntrepreneurId) {
        console.error('Invalid investment data:', { investmentAmount, userId, entrepreneurId: parsedEntrepreneurId });
        return NextResponse.json({ error: 'Invalid investment data' }, { status: 400 });
      }

      // Get current user's email from Clerk
      const user = await currentUser();
      const customerEmail = user?.emailAddresses[0]?.emailAddress || null; // Get the email, defaulting to null if not available

      // Create the investment record in the database
      await prisma.investment.create({
        data: {
          amount: investmentAmount,
          title: pitchTitle,
          investorProfileId: parsedUserId,
          entrepreneurProfileId: parsedEntrepreneurId,
          investmentOpportunityId: parseInt(pitchId, 10),
        },
      });

      // Check if customerEmail is not null before sending confirmation email
      if (customerEmail) {
        await sendConfirmationEmail(customerEmail, investmentAmount, pitchTitle);
      } else {
        console.warn('Customer email is null, skipping email confirmation');
      }

    } catch (error) {
      console.error('Error creating investment:', error);
      return NextResponse.json({ error: 'Failed to create investment' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
