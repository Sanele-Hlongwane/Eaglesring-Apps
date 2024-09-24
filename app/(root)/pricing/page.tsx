"use client";

import { useState, useEffect } from "react";
import { ClerkProvider, SignedIn, useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CurrentPlan from "@/components/pricing/current-plan";
import { plans } from "@/constants/plans";
import { FaCheck, FaTimes} from "react-icons/fa";
import LoadingDots from "@/components/ui/LoadingDots";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const SubscriptionForm = () => {
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, [user?.primaryEmailAddress?.emailAddress]);

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
  };

  const handleSubmit = async (planName: string) => {
    setIsLoading(true);
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!planName || !user?.id || !userEmail) {
      toast.info("Please select a plan and ensure you are logged in.");
      setIsLoading(false);
      return;
    }

    const selectedPlanData = plans.find((plan) => plan.name === planName);
    if (!selectedPlanData) {
      toast.info("Invalid plan selected.");
      setIsLoading(false);
      return;
    }

    const priceId =
      typeof selectedPlanData.stripePriceId === "string"
        ? selectedPlanData.stripePriceId
        : isYearly
          ? selectedPlanData.stripePriceId.yearly
          : selectedPlanData.stripePriceId.monthly;

    if (!priceId) {
      toast.info("Invalid price ID.");
      return;
    }

    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId, userId: user.id, email: userEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Error: ${data.message}`);
        return;
      }

      const stripe = await stripePromise;
      const { error } =
        (await stripe?.redirectToCheckout({ sessionId: data.id })) || {};

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="relative container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-18 text-center">
        Subscription Plans
      </h1>
      <SignedIn>
        <CurrentPlan />
      </SignedIn>

      <div className="flex justify-center mb-6 space-x-2">
        <button
          className={`px-6 py-3 rounded-l-md text-lg font-medium transition-all duration-300 ${
            !isYearly
              ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setIsYearly(false)}
          aria-pressed={!isYearly}
        >
          Monthly
        </button>
        <button
          className={`px-6 py-3 rounded-r-md text-lg font-medium transition-all duration-300 ${
            isYearly
              ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setIsYearly(true)}
          aria-pressed={isYearly}
        >
          Yearly (Save 20%)
        </button>
      </div>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-lg p-6 transition-transform duration-300 ${
                selectedPlan === plan.name
                  ? "border-green-600 shadow-lg transform scale-105"
                  : "border-blue-800"
              }`}
              role="button"
              tabIndex={0}
              onClick={() => handlePlanSelect(plan.name)}
              onKeyPress={(e) =>
                e.key === "Enter" && handlePlanSelect(plan.name)
              }
              aria-label={`Select ${plan.name} plan`}
            >
              <h2 className="text-2xl font-semibold mb-2 flex items-center">
                <span className="mr-2 text-green-600">{plan.name}</span>
              </h2>
              <p className="text-lg font-bold mb-4">
                {isYearly ? (
                  <>
                    <span className="line-through text-gray-500">
                      R{plan.monthlyPrice * 12}
                    </span>{" "}
                    R{plan.yearlyPrice} per year
                  </>
                ) : (
                  `R${plan.monthlyPrice} per month`
                )}
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <FaCheck className="text-green-500 mr-2" /> {feature}
                  </li>
                ))}
                {plan.unavailable.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-500 line-through"
                  >
                    <FaTimes className="text-red-500 mr-2" /> {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`w-full py-2 px-4 rounded-lg font-bold transition-colors duration-300 ${
                  selectedPlan === plan.name
                    ? "bg-green-600 text-white"
                    : "bg-blue-800 text-gray-200"
                }`}
                onClick={() => handleSubmit(plan.name)}
                disabled={isLoading}
              >
                {isLoading ? <LoadingDots /> : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm;
