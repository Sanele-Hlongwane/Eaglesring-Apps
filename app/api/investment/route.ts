import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const prisma = new PrismaClient();

interface InvestmentData {
  amount: number;                     // Adjust based on your model
  title: string;                      // Adjust based on your model
  investorProfileId: number;          // Assuming this is a number
  entrepreneurProfileId: number;       // Assuming this is a number
  investmentOpportunityId: number;    // Assuming this is a number
  pitchId?: number;                   // Optional if it can be null
}

async function saveInvestment(investmentData: InvestmentData) {
  // Check if the investment already exists
  const existingInvestment = await prisma.investment.findFirst({
    where: {
      AND: [
        { investorProfileId: investmentData.investorProfileId },
        { investmentOpportunityId: investmentData.investmentOpportunityId },
      ],
    },
  });


  // If it doesn't exist, create a new investment
  if (!existingInvestment) {
    return await prisma.investment.create({
      data: investmentData,
    });
  } else {
    console.log(`Investment already exists: ${existingInvestment.id}`);
    return existingInvestment; // Return the existing investment if it already exists
  }
}

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
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

    // Fetch investments made by the user from the database
    const investments = await prisma.investment.findMany({
      where: { investorProfileId: dbUser.id },
      include: {
        investmentOpportunity: {
          include: {
            entrepreneurProfile: true, // Include entrepreneur profile if needed
          },
        },
      },
    });


    // Optionally, fetch Stripe data if needed
    const stripeCustomerId = dbUser.stripeCustomerId;

    if (stripeCustomerId) {
      const charges = await stripe.charges.list({
        customer: stripeCustomerId,
        limit: 100, // Limit to the number of charges you want to retrieve
      });

      console.log('Stripe Charges:', charges.data);
    }

    // Create and save new investments with metadata
    for (const investment of investments) {
      const investmentData: InvestmentData = {
        amount: investment.amount, // Ensure this is defined correctly in your investment type
        title: investment.title, // Ensure this field is present
        investorProfileId: dbUser.id,
        entrepreneurProfileId: investment.entrepreneurProfileId,
        investmentOpportunityId: investment.investmentOpportunityId,
      };

      // Save investment only if it's new
      await saveInvestment(investmentData);
    }

    return NextResponse.json({ investments });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
  }
}
