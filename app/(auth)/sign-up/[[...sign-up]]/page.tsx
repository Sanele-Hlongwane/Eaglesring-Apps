"use client";

import { SignedIn, SignedOut, useUser, SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import {
  FaLightbulb,
  FaShieldAlt,
  FaComments,
  FaUserTie,
  FaChartLine,
  FaRegGem,
  FaHandsHelping,
  FaGlobe,
  FaRocket,
  FaAward,
  FaMedal,
} from "react-icons/fa";

export default function SignUpPage() {
  const router = useRouter();
  const { user } = useUser();

  const handleDashboardRedirect = () => {
    router.push("/");
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-white">
      {/* Background Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <FaLightbulb className="text-yellow-500 absolute top-16 left-20 text-[100px] rotate-12" />
        <FaShieldAlt className="text-blue-500 absolute top-1/3 right-10 text-[120px] rotate-6" />
        <FaComments className="text-green-500 absolute bottom-16 left-1/4 text-[80px] -rotate-12" />
        <FaUserTie className="text-red-500 absolute top-1/4 left-10 text-[90px] rotate-45" />
        <FaChartLine className="text-purple-500 absolute bottom-20 right-1/3 text-[110px] -rotate-6" />
        <FaRegGem className="text-pink-500 absolute bottom-1/4 left-2/3 text-[100px] rotate-12" />
        {/* Additional Icons */}
        <FaHandsHelping className="text-yellow-400 absolute top-20 right-5 text-[90px] rotate-12" />
        <FaGlobe className="text-blue-400 absolute bottom-28 right-14 text-[100px] rotate-12" />
        <FaRocket className="text-red-400 absolute top-1/3 left-14 text-[80px] rotate-45" />
        <FaAward className="text-orange-500 absolute bottom-10 left-32 text-[120px] rotate-6" />
        <FaMedal className="text-green-400 absolute top-10 right-32 text-[110px] -rotate-12" />
      </div>

      <SignedIn>
        <div className="flex flex-col items-center justify-center h-full w-full p-4 sm:p-8 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 text-center">
            Welcome Back,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-700 via-orange-600 to-blue-800 dark:from-yellow-400 dark:via-pink-500 dark:to-purple-500">
              {user?.firstName || "Friend"}!
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-800 dark:text-gray-300 mb-6 sm:mb-8 text-center">
            You&apos;re already logged in. Let&apos;s get you back to where the action
            happens!
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
        <div className="flex items-center justify-center min-h-screen">
          <SignUp />
        </div>
      </SignedOut>
    </main>
  );
}
