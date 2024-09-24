import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Current Meeting Active",
    description: "Join and manage your current active meetings.",
  };

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
        {children}
    </main>
  );
};

export default Layout;
