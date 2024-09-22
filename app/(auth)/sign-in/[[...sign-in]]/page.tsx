"use client";

import { SignedIn, SignedOut, useUser, SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

export default function SignInPage() {
  const router = useRouter();
  const { user } = useUser();

  const handleDashboardRedirect = () => {
    router.push("/");
  };

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignedIn>
        <div className="flex flex-col items-center justify-center h-full w-full p-4 sm:p-8 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 text-center">
            Welcome Back,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-700 via-orange-600 to-blue-800 dark:from-yellow-400 dark:via-pink-500 dark:to-purple-500">
              {user?.firstName || "Friend"}!
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-800 dark:text-gray-300 mb-6 sm:mb-8 text-center">
            You're already logged in. Let’s get you back to where the action happens!
          </p>
          <Button
            onPress={handleDashboardRedirect}
            className="bg-gradient-to-r from-gray-700 via-gray-900 to-black hover:bg-gradient-to-l dark:from-gray-200 dark:via-gray-300 dark:to-blue-200 text-white dark:text-black font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </main>
  );
}
