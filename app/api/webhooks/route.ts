import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
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

// Webhook to handle successful payment
export default async function handler(request: Request) {
  if (request.method === 'POST') {
    let event;
    const sig = request.headers.get('stripe-signature')!;
    try {
      event = stripe.webhooks.constructEvent(
        await request.text(),
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!  // Ensure this key is correct
      );
    } catch (err) {
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
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}
