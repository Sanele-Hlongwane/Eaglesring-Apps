import { Metadata } from "next";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import ResponsiveNav from "@/components/ResponsiveNav";
import Sidebar from "@/components/Sidebar";

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <Navbar />
      <div className="w-full">{children}</div>
      <Footer />
    </main>
  );
};

export default Layout;
