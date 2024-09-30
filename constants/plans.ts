import { ReactNode } from "react";

export interface Plan {
  yearlyDiscount: boolean;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  unavailable: string[];
  buttonLabel: string;
  stripePriceId: string | { monthly: string; yearly: string };
  description?: ReactNode;
  details?: ReactNode;
  unavailableFeatures: string[];
}

export const plans: Plan[] = [
  {
    name: 'Basic',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Basic support - Available',
      'Community events - Available',
      'Newsletters - Available',
    ],
    unavailable: [
      'Early access to updates - Not Available',
      'Exclusive content - Not Available',
      'Premium content - Not Available',
      'Additional storage - Not Available'
    ],
    buttonLabel: 'Join for Free',
    stripePriceId: process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE_ID!,
    description: 'The Basic plan provides essential access to community forums, basic support, and is completely free of charge. It includes community events and newsletters but does not offer advanced features or exclusive content.',
    details: 'This plan includes access to community forums, basic support, and free access. It does not include advanced features like premium content, priority support, or dedicated account management.',
    unavailableFeatures: [
      'Early access to updates',
      'Exclusive content'
    ],
    yearlyDiscount: false
  },
  {
    name: 'Pro',
    monthlyPrice: 450,
    yearlyPrice: 4500,
    features: [
      'Dedicated account manager - Available',
      'Advanced analytics - Available',
      'Custom integrations - Available',
    ],
    unavailable: [
      'Exclusive content - Not Available',
      'Additional storage - Not Available',
      'One-on-one training - Not Available',
      'Early access to updates - Not Available',
    ],
    buttonLabel: 'Subscribe Now',
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PRO_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PRO_ANNUAL_PRICE_ID!,
    },
    description: 'The Pro plan includes premium content, priority support, and a dedicated account manager, along with additional features like advanced analytics and custom integrations. It does not include exclusive content.',
    details: 'This plan offers comprehensive support and advanced features, excluding exclusive content and some high-end customization options. It is ideal for users needing robust features and priority support.',
    unavailableFeatures: [
      'Exclusive content',
      'Additional storage',
      'One-on-one training'
    ],
    yearlyDiscount: false
  },
  {
    name: 'Premium',
    monthlyPrice: 800,
    yearlyPrice: 8000,
    features: [
      'Priority support - Available',
      'Dedicated account manager - Available',
      'Advanced analytics - Available',
      'Custom integrations - Available',
      'Exclusive content - Available',
      'Additional storage - Available',
      'Priority customer support - Available',
      'One-on-one training - Available'
    ],
    unavailable: [],
    buttonLabel: 'Subscribe Now',
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PREMIUM_ANNUAL_PRICE_ID!,
    },
    description: 'The Premium plan includes all features of the Pro plan plus exclusive content, priority support, additional storage, and one-on-one training, offering the most comprehensive support available.',
    details: 'This plan offers the most extensive range of features, including exclusive content, priority customer support, additional storage, and one-on-one training. Ideal for users who need the best services.',
    unavailableFeatures: [],
    yearlyDiscount: false
  },
];