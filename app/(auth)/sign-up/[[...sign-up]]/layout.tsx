import { Metadata } from "next";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { SignedIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Find and connect with entrepreneurs.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <SignedIn>
        <Navbar />
      </SignedIn>
      <div className="p-10">{children}</div>
      <SignedIn>
        <Footer />
      </SignedIn>
    </main>
  );
};

export default Layout;
