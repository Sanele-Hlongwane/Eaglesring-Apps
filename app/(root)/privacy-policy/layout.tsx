import { Metadata } from "next";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "We care about your privacy here at Eagles Rings. Read and undersatnd our policies.",
};

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
