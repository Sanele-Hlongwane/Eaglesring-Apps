import Stripe from "stripe";
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma'; // Adjust the import path according to your project structure
import { currentUser } from '@clerk/nextjs/server'; // Import Clerk's currentUser function

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    // Retrieve the current user
    const user = await currentUser();
    console.log("Current user:", user);
    
    if (!user) {
      console.error("User not authenticated");
      return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
    }

    // Parse JSON body from the request
    const body = await req.json();
    const { amount } = body; // Use only amount from the body; other fields are pulled from session metadata
    console.log("Request body:", body);

    // Fetch the customer object based on the current user's email
    const customers = await stripe.customers.list({
      email: user.emailAddresses[0].emailAddress,
    });
    console.log("Stripe customers:", customers);

    if (customers.data.length === 0) {
      console.error("Customer not found");
      return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404 });
    }

    const customerId = customers.data[0].id; // Get the customer ID
    console.log("Customer ID:", customerId);

    // Retrieve the list of checkout sessions for this customer
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
    });
    console.log("Checkout sessions:", sessions);

    // Filter sessions to find successful payments with mode 'payment'
    const successfulSessions = sessions.data.filter((session) => 
      session.payment_status === "paid" && session.mode === "payment"
    );
    console.log("Successful payment sessions:", successfulSessions);

    // Process each successful session to create investment records if the required metadata is present
    for (const session of successfulSessions) {
      const { metadata } = session;
      console.log("Processing session metadata:", metadata);

      // Ensure metadata contains all the required fields
      if (metadata && metadata.entrepreneurProfileId && metadata.investmentOpportunityId && metadata.pitchTitle && metadata.userId) {
        console.log("Required metadata found for session:", session.id);
        
        // Convert metadata IDs to numbers
        const investorProfileId = parseInt(metadata.userId, 10);
        const entrepreneurProfileId = parseInt(metadata.entrepreneurProfileId, 10);
        const investmentOpportunityId = parseInt(metadata.investmentOpportunityId, 10);

        // Check if the investment already exists
        const existingInvestment = await db.investment.findFirst({
          where: {
            investorProfileId, // Use converted number
            entrepreneurProfileId, // Use converted number
            investmentOpportunityId, // Use converted number
            title: metadata.pitchTitle,
          },
        });
        console.log("Existing investment:", existingInvestment);

        // If the investment does not exist, create it
        if (!existingInvestment) {
          console.log("Creating new investment record for:", metadata.pitchTitle);
          await db.investment.create({
            data: {
              amount: parseFloat(amount), // Amount comes from the request body
              title: metadata.pitchTitle, // Title comes from the metadata
              investorProfile: { connect: { id: investorProfileId } },
              entrepreneurProfile: { connect: { id: entrepreneurProfileId } },
              investmentOpportunity: { connect: { id: investmentOpportunityId } },
            },
          });
          console.log("Investment record created successfully.");
        } else {
          console.log("Investment record already exists, skipping creation.");
        }
      } else {
        console.error("Missing required metadata in session:", session.id);
      }
    }

    return new Response(JSON.stringify({ successfulSessions }), { status: 200 });

  } catch (error) {
    console.error("Error processing Stripe sessions:", error);
    return new Response(JSON.stringify({ error: "Error processing Stripe sessions" }), { status: 500 });
  }
}
