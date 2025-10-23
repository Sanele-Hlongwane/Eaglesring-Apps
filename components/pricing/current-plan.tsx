"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { plans, Plan } from "@/constants/plans";
import Loader from "@/components/Loader";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,
  FaListAlt,
  FaCalendarAlt,
  FaCalendarCheck,
  FaCog,
} from "react-icons/fa";
import LoadingDots from "../ui/LoadingDots";

const CurrentPlan = () => {
  const { user } = useUser();
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<{
    nextBillingDate: string;
    subscriptionStartDate: string;
    status: string;
  } | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "details" | "manage" | "payment"
  >("overview");
  const [availablePlans, setAvailablePlans] = useState<Plan[]>(plans);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        try {
          const response = await fetch(
            `/api/current-subscription?email=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`,
          );
          const data = await response.json();

          if (response.ok) {
            if (data.currentPlan) {
              const plan = plans.find(
                (plan) =>
                  plan.stripePriceId === data.currentPlan ||
                  (typeof plan.stripePriceId === "object" &&
                    (plan.stripePriceId.monthly === data.currentPlan ||
                      plan.stripePriceId.yearly === data.currentPlan)),
              );
              setCurrentPlan(plan || null);
              setIsYearly(data.isYearly);
              setSubscriptionDetails({
                nextBillingDate: new Date(
                  data.nextBillingDate * 1000,
                ).toLocaleDateString(),
                subscriptionStartDate: new Date(
                  data.subscriptionStartDate * 1000,
                ).toLocaleDateString(),
                status: data.status,
              });
              setPaymentMethods(data.paymentMethods);
            }
          } else {
            toast.error(
              data.message ||
                "An error occurred while fetching the subscription plan.",
            );
          }
        } catch (error) {
          console.error("Error fetching current plan:", error);
          toast.error("An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCurrentPlan();
  }, [user?.primaryEmailAddress?.emailAddress]);

  const handleCancelSubscription = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const confirmed = window.confirm(
        "Are you sure you want to cancel your subscription? This action cannot be undone, and any money paid will not be refunded.",
      );

      if (confirmed) {
        try {
          const response = await fetch("/api/cancel-subscription", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.primaryEmailAddress.emailAddress,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            setCurrentPlan(null);
            toast.success("Subscription canceled successfully.");
          } else {
            toast.error(data.message || "Error canceling subscription.");
          }
        } catch (error) {
          toast.error("An unexpected error occurred.");
        }
      }
    }
  };

  const handleUpdatePlan = async (
    newPlanId: string | { monthly: string; yearly: string },
  ) => {
    if (user?.primaryEmailAddress?.emailAddress) {
      try {
        const planId =
          typeof newPlanId === "string"
            ? newPlanId
            : isYearly
              ? newPlanId.yearly
              : newPlanId.monthly;
        const response = await fetch("/api/update-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.primaryEmailAddress.emailAddress,
            newPlanId: planId,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setCurrentPlan(
            plans.find((plan) => plan.stripePriceId === planId) || null,
          );
          toast.success("Plan updated successfully.");
        } else {
          toast.error(data.message || "Error updating plan.");
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="w-full py-12 mx-auto">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-center items-center bg-gradient-to-r from-gray-300 to-blue-500 text-black dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-900 dark:text-white py-4">
          <h2 className="text-3xl font-bold">Current Plan</h2>
        </div>
        <div className="p-6">
          <div className="border-b border-gray-300 dark:border-gray-700">
            <div className="flex flex-wrap justify-center gap-2 p-2">
              {[
                { name: "Overview", icon: FaListAlt, tab: "overview" },
                { name: "Details", icon: FaCog, tab: "details" },
                { name: "Manage", icon: FaTimesCircle, tab: "manage" },
                { name: "Payment Methods", icon: FaCreditCard, tab: "payment" },
              ].map((item) => (
                <button
                  key={item.tab}
                  className={`flex items-center text-xs sm:text-sm md:text-base font-semibold py-2 px-3 sm:py-2.5 sm:px-4 border-b-2 ${
                    activeTab === item.tab
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-700 dark:text-gray-200"
                  } hover:border-blue-500 focus:outline-none`}
                  onClick={() =>
                    setActiveTab(
                      item.tab as "overview" | "details" | "manage" | "payment",
                    )
                  }
                  role="tab"
                  aria-selected={activeTab === item.tab}
                >
                  <item.icon className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[calc(100vh-15rem)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <LoadingDots />
              </div>
            ) : activeTab === "overview" ? (
              currentPlan ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Plan:{" "}
                      <span className="font-bold">{currentPlan.name}</span>
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">
                      {isYearly
                        ? `Yearly - R${currentPlan.yearlyPrice} per year`
                        : `Monthly - R${currentPlan.monthlyPrice} per month`}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Next Billing Date
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">
                      {subscriptionDetails?.nextBillingDate}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Subscription Start Date
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">
                      {subscriptionDetails?.subscriptionStartDate}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Status
                    </div>
                    <div
                      className={`text-lg font-bold ${subscriptionDetails?.status === "active" ? "text-green-600" : "text-red-600"}`}
                    >
                      {subscriptionDetails?.status}
                    </div>
                  </div>
                  <button
                    onClick={handleCancelSubscription}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
                  >
                    Cancel Subscription
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-700 dark:text-gray-200">
                  <p>
                    No active subscription found. Consider subscribing to a
                    plan!
                  </p>
                </div>
              )
            ) : activeTab === "details" ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Plan Details</h3>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                  <p>{currentPlan?.details}</p>
                </div>
              </div>
            ) : activeTab === "manage" ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Manage Subscription</h3>
                <div className="space-x-2">
                  {availablePlans.map((plan) => {
                    const planId =
                      typeof plan.stripePriceId === "string"
                        ? plan.stripePriceId
                        : isYearly
                          ? plan.stripePriceId.yearly
                          : plan.stripePriceId.monthly;

                    return (
                      <button
                        key={planId} // Use planId here, which is guaranteed to be a string
                        onClick={() => handleUpdatePlan(plan.stripePriceId)}
                        className={`bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none ${currentPlan?.stripePriceId === plan.stripePriceId ? "opacity-75" : ""}`}
                        disabled={
                          currentPlan?.stripePriceId === plan.stripePriceId
                        }
                      >
                        Upgrade to {plan.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold">
                          {method.brand} ending in {method.last4}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {method.exp_month}/{method.exp_year}
                        </div>
                      </div>
                      <button className="text-red-600 hover:underline">
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No payment methods available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlan;
