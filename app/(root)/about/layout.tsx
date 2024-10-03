import { Metadata } from "next";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "About",
  description: "Find and connect with entrepreneurs.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <Navbar />
      <div className="w-full m-5">{children}</div>
      <Footer />
    </main>
  );
};

export default Layout;
