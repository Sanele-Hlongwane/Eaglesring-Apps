import Stripe from "stripe";
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma'; // Adjust the import path according to your project structure
import { currentUser } from '@clerk/nextjs/server'; // Import Clerk's currentUser function

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    // Retrieve the current user
    const user = await currentUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
    }

    // Parse JSON body from the request
    const body = await req.json();
    const { amount, title, investorProfileId, entrepreneurProfileId, investmentOpportunityId } = body;

    // Validate required fields
    if (!amount || !title || !investorProfileId || !entrepreneurProfileId || !investmentOpportunityId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Fetch the customer object based on the current user's email
    const customers = await stripe.customers.list({
      email: user.emailAddresses[0].emailAddress,
    });

    if (customers.data.length === 0) {
      return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404 });
    }

    const customerId = customers.data[0].id; // Get the customer ID

    // Retrieve the list of checkout sessions for this customer
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
    });

    // Filter sessions to find successful payments
    const successfulSessions = sessions.data.filter((session) => session.payment_status === "paid");

    // Process each successful session to create investment records
    for (const session of successfulSessions) {
      const { metadata } = session;

      if (metadata && metadata.entrepreneurProfileId && metadata.investmentOpportunityId && metadata.pitchTitle) {
        const existingInvestment = await db.investment.findFirst({
          where: {
            investorProfileId,
            entrepreneurProfileId,
            investmentOpportunityId,
            title: metadata.pitchTitle,
          },
        });

        if (!existingInvestment) {
          await db.investment.create({
            data: {
              amount: parseFloat(amount),
              title: metadata.pitchTitle,
              investorProfile: { connect: { id: investorProfileId } },
              entrepreneurProfile: { connect: { id: entrepreneurProfileId } },
              investmentOpportunity: { connect: { id: investmentOpportunityId } },
            },
          });
        }
      }
    }

    return new Response(JSON.stringify({ successfulSessions }), { status: 200 });

  } catch (error) {
    console.error("Error processing Stripe sessions:", error);
    return new Response(JSON.stringify({ error: "Error processing Stripe sessions" }), { status: 500 });
  }
}
