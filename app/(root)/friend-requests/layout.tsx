import { Metadata } from "next";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Connections",
  description: "Send, accept and manage your onnections.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <div className="w-full">{children}</div>
    </main>
  );
};

export default Layout;
