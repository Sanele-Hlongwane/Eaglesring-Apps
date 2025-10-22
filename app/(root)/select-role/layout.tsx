import { SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Select Your Role",
  description:
    "Choose your path as an entrepreneur or investor. Define your journey and unlock tailored experiences designed for your success.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <div className="w-full">
        <SignedOut>
          <div className="flex justify-center items-center min-h-screen">
            <SignInButton mode="modal">
            <button className="bg-white text-black dark:bg-black dark:text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-gold-600 transition duration-200 ease-in-out">
              Sign in to select role
            </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div>{children}</div>
        </SignedIn>
      </div>
    </main>
  );
};

export default Layout;
