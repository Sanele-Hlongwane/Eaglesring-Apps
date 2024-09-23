"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Cancel = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 3 seconds or handle any post-subscription logic
    const timer = setTimeout(() => {
      router.push("/pricing");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="text-center p-4 rounded-lg max-w-md w-full">
        <svg
          className="w-16 h-16 mx-auto text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h1 className="text-2xl font-semibold mb-2">Subscription Cancelled</h1>
        <p className="text-lg mb-4">
          Your subscription was not completed. We are redirecting you shortly.
        </p>
      </div>
    </div>
  );
};

export default Cancel;
