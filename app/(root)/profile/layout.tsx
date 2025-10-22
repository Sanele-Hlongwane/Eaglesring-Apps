import { Metadata } from "next";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";

export const metadata: Metadata = {
    title: "Profile",
    description: "Showcasing visionary entrepreneurs and their journeys to success. Discover, connect, and be inspired by bold innovators shaping the future.",
  };  

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <div className="w-full">
        <SignedOut>
          <div className="flex justify-center items-center min-h-screen">
            <SignInButton mode="modal">
            <button className="bg-white text-black dark:bg-black dark:text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-gold-600 transition duration-200 ease-in-out">
              Sign in to access your profile
            </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <Navbar/>
          <div>{children}</div>
          <Footer/>
        </SignedIn>
      </div>
    </main>
  );
};

export default Layout;
