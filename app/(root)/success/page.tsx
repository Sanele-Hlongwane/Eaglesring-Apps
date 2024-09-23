"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Success = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 3 seconds or handle any post-subscription logic
    const timer = setTimeout(() => {
      router.push("/pricing");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-4 shadow-lg rounded-lg max-w-md w-full">
        <svg
          className="w-16 h-16 mx-auto text-green-500 mb-4"
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
        <h1 className="text-2xl font-semibold mb-2">
          Subscription Successful!
        </h1>
        <p className="text-lg mb-4">
          Thank you for subscribing. We are redirecting you shortly.
        </p>
      </div>
    </div>
  );
};

export default Success;
