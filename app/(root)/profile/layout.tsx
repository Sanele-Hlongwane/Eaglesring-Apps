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
      <div className="flex w-full">
        <section className="flex min-h-screen w-full flex-col">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
