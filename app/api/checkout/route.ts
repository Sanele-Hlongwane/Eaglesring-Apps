import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import sgMail from '@sendgrid/mail';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const prisma = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

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

    // Fetch the pitch and its entrepreneur profile including user model
    const pitch = await prisma.pitch.findUnique({
      where: { id: pitchId },
      include: {
        entrepreneur: {
          include: {
            user: true, // Include user model to access email
          },
        },
        investmentOpportunity: true,
      },
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

    // Use the stripeCustomerId from the database if it exists
    let customerId = dbUser.stripeCustomerId;

    if (!customerId) {
      const email = user.primaryEmailAddress?.emailAddress || '';

      // Search for an existing Stripe customer using email
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        // Create a new Stripe customer
        const newCustomer = await stripe.customers.create({
          email: email,
          name: user.fullName || '',
          metadata: {
            clerkId: clerkId,
          },
        });
        customerId = newCustomer.id;

        // Store the Stripe customer ID in the database
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { stripeCustomerId: customerId },
        });
      }
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
      customer: customerId,  // Attach the customer to the session
      metadata: {
        pitchId: pitchId.toString(),
        pitchTitle: pitchTitle,
        userId: investorProfile.id.toString(),
        entrepreneurProfileId: entrepreneurProfile.id.toString(),
        investmentOpportunityId: investmentOpportunity.id.toString(),
        investmentId: investment.id.toString(),
      },
    });

    // Use the email from the entrepreneur's user model
    if (entrepreneurProfile.user && entrepreneurProfile.user.email) {
      const emailContent = {
        to: entrepreneurProfile.user.email, // Ensure email is retrieved from user model
        from: "sanelehlongwane61@gmail.com",
        subject: `New Investment in ${pitchTitle}`,
        text: `You have received an investment of R${amountInRands} from ${dbUser.name}.`,
        html: `<p>Congratulations, ${entrepreneurProfile.user.name}!</p><p>You have received an investment of R${amountInRands} from ${dbUser.name} for your pitch: ${pitchTitle} on the Eagles Ring web and you will receive your funds within 2 working days through the card you subscribed with, if you wish to receive it through another method please contact us.  </p>`,
      };

      await sgMail.send(emailContent);
    }

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
