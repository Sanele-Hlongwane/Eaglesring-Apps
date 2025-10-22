import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: Request) {
  try {
    const { email, newPlanId } = await request.json();

    if (!email || !newPlanId) {
      return NextResponse.json(
        { message: "Email and newPlanId are required" },
        { status: 400 },
      );
    }

    // Retrieve customer by email
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

    // Retrieve subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
    });

    const subscription = subscriptions.data[0];
    if (!subscription) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 },
      );
    }

    // Update the subscription
    await stripe.subscriptions.update(subscription.id, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPlanId,
        },
      ],
    });

    return NextResponse.json({ message: "Subscription updated successfully" });
  } catch (err) {
    console.error("Error updating subscription:", err);
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 },
    );
  }
}
