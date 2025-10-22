import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: Request) {
  try {
    const { priceId, email, userId } = await request.json();

    if (!priceId || !email || !userId) {
      return NextResponse.json(
        { message: "Price ID, email, and user ID are required" },
        { status: 400 },
      );
    }

    // Retrieve or create a customer in Stripe
    let customer = await stripe.customers
      .list({
        email,
        limit: 1,
      })
      .then((res) => res.data[0]);

    if (!customer) {
      customer = await stripe.customers.create({
        email,
        metadata: { clerkId: userId },
      });
    }

    // Check if the customer already has an active subscription
    const activeSubscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
    });

    if (activeSubscriptions.data.length > 0) {
      console.log(
        "Customer already has an active subscription. Proceeding without canceling.",
      );
    }

    // Create a Checkout Session for the selected plan
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/canceled`,
    });

    // Handle the cancellation of previous subscriptions after successful checkout
    if (session.payment_status === "paid") {
      // Cancel previous subscriptions
      for (const subscription of activeSubscriptions.data) {
        await stripe.subscriptions.cancel(subscription.id);
      }
    }

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error("Error creating subscription:", err);
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 },
    );
  }
}
