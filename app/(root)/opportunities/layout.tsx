import { Metadata } from "next";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Find and connect with entrepreneurs.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="relative">
      <div className="flex">
        <Navbar />
          <div className="w-full">{children}</div>
        <Footer />
      </div>
    </main>
  );
};

export default Layout;
