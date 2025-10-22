import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 },
      );
    }

    // Retrieve customer by email (you should store the Stripe customer ID in your database)
    const customers = await stripe.customers.list({
      email: userId, // Adjust if needed based on how you store and retrieve customer information
      limit: 1,
    });

    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
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
    if (!activeSubscription) {
      return NextResponse.json(
        { message: "No active subscription found" },
        { status: 404 },
      );
    }

    // Cancel the subscription
    await stripe.subscriptions.cancel(activeSubscription.id);

    return NextResponse.json({ message: "Subscription canceled successfully" });
  } catch (err) {
    console.error("Error canceling subscription:", err);
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 },
    );
  }
}
