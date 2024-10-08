"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Import Clerk hook
import axios from "axios";

const Success = () => {
  const router = useRouter();
  const { user } = useUser(); // Get current user from Clerk
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStripeSessions = async () => {
      if (!user) return;

      try {
        // Call your backend API to get successful Stripe checkout sessions
        const { data } = await axios.post("/api/investment", {
          amount: 1000, // Dynamic amount can be handled in the backend
          title: "Investment Opportunity",
          investorProfileId: user.id, // Adjust based on actual profile handling
          entrepreneurProfileId: "entrepreneur-profile-id", // Replace with actual ID
          investmentOpportunityId: "investment-opportunity-id", // Replace with actual ID
        });

        console.log("Investments processed successfully", data);
      } catch (error) {
        console.error("Error checking Stripe sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStripeSessions();

    const timer = setTimeout(() => {
      router.push("/"); // Redirect to home after 3 seconds
    }, 3000);

    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="text-center p-8 shadow-xl rounded-2xl max-w-md w-full bg-white">
        <svg
          className="w-20 h-20 mx-auto text-green-500 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Investment Successful!
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {loading
            ? "Processing your investment..."
            : "Thank you for investing. You will be redirected shortly."}
        </p>
        {!loading && (
          <div className="text-gray-500 text-sm">
            Redirecting in 3 seconds...
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
