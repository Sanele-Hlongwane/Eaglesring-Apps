import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    // Retrieve customer by email from Stripe
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }

    // Fetch the user from the database by email
    const dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found in the database" },
        { status: 404 },
      );
    }

    // Update the user's Stripe customer ID if it's not already set
    if (!dbUser.stripeCustomerId) {
      await prisma.user.update({
        where: { email },
        data: { stripeCustomerId: customer.id },
      });
    }

    // Retrieve subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
    });

    // Find the active subscription
    const activeSubscription = subscriptions.data.find(
      (sub) => sub.status === "active",
    );

    // Retrieve payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });

    // Map payment methods to include last 4 digits and expiration date
    const paymentMethodsWithDetails = paymentMethods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand,
      last4: pm.card?.last4,
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
    }));

    return NextResponse.json({
      currentPlan: activeSubscription?.items.data[0]?.price.id,
      nextBillingDate: activeSubscription?.ended_at,
      subscriptionStartDate: activeSubscription?.start_date,
      status: activeSubscription?.status,
      paymentMethods: paymentMethodsWithDetails,
    });
  } catch (err) {
    console.error("Error fetching subscription:", err);
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 },
    );
  }
}
