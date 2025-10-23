"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { title } from "@/components/primitives";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/pricing");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-white">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-200 dark:border-blue-700 space-y-6 max-w-md w-full">
        <div className="flex justify-center">
          <svg
            className="h-16 w-16 text-green-500 dark:text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>

          <h1 className={`${title()} text-center text-xl font-bold`}>
            Success!
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-center text-lg">
          Your role has been successfully assigned. You will be redirected
          shortly.
        </p>
      </div>
    </div>
  );
}
