import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import axios from "axios";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface CheckoutButtonProps {
  pitchId: number;
  amount: number;
  pitchTitle: string;
  onClick: () => Promise<void>;
}

const CheckoutButton = ({ pitchId, amount, onClick }: CheckoutButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Checkout Error:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-blue-600 text-white py-2 px-4 rounded"
    >
      {loading ? "Processing..." : "Invest Now"}
    </button>
  );
};

export default CheckoutButton;
