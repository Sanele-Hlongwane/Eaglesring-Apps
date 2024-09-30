"use client";

import { useState, useEffect } from "react";
import { ClerkProvider, SignedIn, useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CurrentPlan from "@/components/pricing/current-plan";
import { plans } from "@/constants/plans";
import { FaCheck, FaTimes, FaDollarSign, FaMoneyBillAlt, FaCalendar, FaCalendarAlt } from "react-icons/fa";
import LoadingDots from "@/components/ui/LoadingDots";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
} from "@nextui-org/react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SubscriptionForm = () => {
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {}, [user?.primaryEmailAddress?.emailAddress]);

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
  };

  const handleSubmit = async (planName: string) => {
    setLoadingPlan(planName);
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!planName || !user?.id || !userEmail) {
      toast.info("Please select a plan and ensure you are logged in.");
      setLoadingPlan(null);
      return;
    }

    const selectedPlanData = plans.find((plan) => plan.name === planName);
    if (!selectedPlanData) {
      toast.info("Invalid plan selected.");
      setLoadingPlan(null);
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
      setLoadingPlan(null);
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
        setLoadingPlan(null);
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
      setLoadingPlan(null);
    }
  };

  return (
    <div className="py-8 px-4 bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">Price plans</h1>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsYearly(false)}
          className={`px-8 py-3 rounded-l-lg transition duration-300 transform hover:scale-105 ${!isYearly ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={`px-8 py-3 rounded-r-lg transition duration-300 transform hover:scale-105 ${isYearly ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          Yearly <p className={`${isYearly ? "text-green-300" : "text-green-800"}`}>(Save~17%)</p>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            onClick={() => handlePlanSelect(plan.name)}
            className={`shadow-lg rounded-lg border-2 ${selectedPlan === plan.name ? "border-green-600" : "border-blue-800"}`}
          >
            <CardHeader className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-300 to-blue-400 rounded-t-lg text-gray-900 dark:text-white">
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <FaMoneyBillAlt className="text-3xl" />
            </CardHeader>
            <Divider />
            <CardBody className="p-4">
              <p className="text-lg font-bold mb-4">
                {isYearly ? (
                <>
                  <span className="line-through text-red-500">
                    R{plan.monthlyPrice * 12}
                  </span>{" "}
                  <span className="text-green-500">R{plan.yearlyPrice}</span> per year
                </>
              ) : (
                <>
                  <span className="text-green-500">R{plan.monthlyPrice}</span> per month
                </>
              )}

              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-900 dark:text-white">
                    <FaCheck className="text-green-500 mr-2" /> {feature}
                  </li>
                ))}
                {plan.unavailable.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-400 line-through">
                    <FaTimes className="text-red-500 mr-2" /> {feature}
                  </li>
                ))}
              </ul>
            </CardBody>
            <Divider />
            <CardFooter className="p-4">
              <Button
                className={`w-full py-2 px-4 rounded-lg font-bold transition-colors duration-300 ${
                  selectedPlan === plan.name ? "bg-green-600 text-white" : "bg-blue-800 text-gray-200"
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card click event
                  handleSubmit(plan.name);
                }}
                disabled={loadingPlan === plan.name}
              >
                {loadingPlan === plan.name ? <LoadingDots /> : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <SignedIn>
        <CurrentPlan />
      </SignedIn>
    </div>
  );
};

export default SubscriptionForm;
