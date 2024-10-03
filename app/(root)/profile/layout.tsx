import { Metadata } from "next";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
    title: "Profile",
    description: "Showcasing visionary entrepreneurs and their journeys to success. Discover, connect, and be inspired by bold innovators shaping the future.",
  };  

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="relative w-full">
      <Navbar />
      <div className="flex w-full">
        <div className="w-full">{children}</div>
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
