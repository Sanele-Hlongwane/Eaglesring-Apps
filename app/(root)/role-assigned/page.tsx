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

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [router]);

  return (
    <div className="flex items-center textt-sm justify-center h-screen">
      <div className="p-8 rounded-lg border-1 border-blue-200 space-y-6 max-w-md">
        <div className="flex justify-center">
          <svg
            className="h-16 w-16 text-green-500"
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
        
        <h1 className={`${title()} text-center text-sm font-bold `}>
          Success!
        </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-center text-xl">
          Your role has been successfully assigned. You will be redirected shortly.
        </p>
        
      </div>
    </div>
  );
}
