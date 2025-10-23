"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function AddFreeCredits() {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "You need to sign in first." };
  }

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      credits: 10,
    },
  });

  return { success: true, error: null };
}

type LineItem = Stripe.Checkout.SessionCreateParams.LineItem;

export async function createStripeCheckoutSession(lineItems: LineItem[]) {
  const user = await currentUser();
  if (!user) {
    return { sessionId: null, checkoutError: "You need to sign in first." };
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL as string;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: lineItems,
    success_url: `${origin}/checkout?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: origin,
    customer_email: user.emailAddresses[0].emailAddress,
  });

  return { sessionId: session.id, checkoutError: null };
}

export async function retrieveStripeCheckoutSession(sessionId: string) {
  if (!sessionId) {
    return { success: false, error: "No session ID provided." };
  }

  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You need to sign in first." };
  }

  const previousCheckoutSessionIds = Array.isArray(
    user.publicMetadata.checkoutSessionIds,
  )
    ? user.publicMetadata.checkoutSessionIds
    : [];

  if (previousCheckoutSessionIds.includes(sessionId)) {
    return {
      success: true,
      error: null,
    };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      credits: 100,
      checkoutSessionIds: [...previousCheckoutSessionIds, sessionId],
      stripeCustomerId: session.customer,
      stripeSubscriptionId:
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id,
      stripeCurrentPeriodEnd:
        typeof session.subscription === "string"
          ? undefined
          : session.subscription?.current_period_end,
    },
  });

  return { success: true, error: null };
}

export const getURL = (path: string = "") => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL &&
    process.env.NEXT_PUBLIC_SITE_URL.trim() !== ""
      ? process.env.NEXT_PUBLIC_SITE_URL
      : process?.env?.NEXT_PUBLIC_VERCEL_URL &&
          process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ""
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : "http://localhost:3000/";

  url = url.replace(/\/+$/, "");
  url = url.includes("http") ? url : `https://${url}`;
  path = path.replace(/^\/+/, "");

  return path ? `${url}/${path}` : url;
};

export const postData = async ({ url, data }: { url: string; data?: any }) => {
  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date(+0);
  t.setSeconds(secs);
  return t;
};

export const calculateTrialEndUnixTimestamp = (
  trialPeriodDays: number | null | undefined,
) => {
  if (
    trialPeriodDays === null ||
    trialPeriodDays === undefined ||
    trialPeriodDays < 2
  ) {
    return undefined;
  }

  const currentDate = new Date();
  const trialEnd = new Date(
    currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000,
  );
  return Math.floor(trialEnd.getTime() / 1000);
};

const toastKeyMap: { [key: string]: string[] } = {
  status: ["status", "status_description"],
  error: ["error", "error_description"],
};

const getToastRedirect = (
  path: string,
  toastType: string,
  toastName: string,
  toastDescription: string = "",
  disableButton: boolean = false,
  arbitraryParams: string = "",
): string => {
  const [nameKey, descriptionKey] = toastKeyMap[toastType];

  let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;

  if (toastDescription) {
    redirectPath += `&${descriptionKey}=${encodeURIComponent(
      toastDescription,
    )}`;
  }

  if (disableButton) {
    redirectPath += `&disable_button=true`;
  }

  if (arbitraryParams) {
    redirectPath += `&${arbitraryParams}`;
  }

  return redirectPath;
};

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription: string = "",
  disableButton: boolean = false,
  arbitraryParams: string = "",
) =>
  getToastRedirect(
    path,
    "status",
    statusName,
    statusDescription,
    disableButton,
    arbitraryParams,
  );

export const getErrorRedirect = (
  path: string,
  errorName: string,
  errorDescription: string = "",
  disableButton: boolean = false,
  arbitraryParams: string = "",
) =>
  getToastRedirect(
    path,
    "error",
    errorName,
    errorDescription,
    disableButton,
    arbitraryParams,
  );
