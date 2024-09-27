import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

// Initialize Stripe and Prisma client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
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

// Handle POST requests for webhooks
export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')!;
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract metadata
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
      investmentOpportunityId: string;
    };

    try {
      // Create the investment record in the database
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
      return NextResponse.json({ error: 'Error processing investment' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
