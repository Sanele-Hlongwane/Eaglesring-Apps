import { Footer } from "@/components/Footer";
import { Metadata } from "next";
import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Find the best pricing plan that fits your needs.",
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
