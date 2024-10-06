import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Messages",
  description: "Find and connect with entrepreneurs.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <Navbar />
      <div className="w-full">{children}</div>
    </main>
  );
};

export default Layout;
