import { Metadata } from "next";
import { ReactNode } from "react";
import Sidenav from "@/components/ui/investorSideBar";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Find and connect with entrepreneurs.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="flex h-screen">
      <Sidenav />
      <div className="flex-1  p-6 transition-all duration-300">
        {children}
      </div>
    </main>
  );
};

export default Layout;
