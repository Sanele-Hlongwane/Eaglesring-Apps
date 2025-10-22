import { Metadata } from "next";
import { ReactNode } from "react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Messages",
  description: "Find and connect with entrepreneurs.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <div className="w-full">
        <SignedOut>
          <div className="flex justify-center items-center min-h-screen">
            <SignInButton mode="modal">
            <button className="bg-white text-black dark:bg-black dark:text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-gold-600 transition duration-200 ease-in-out">
              Sign in to access your messages
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
