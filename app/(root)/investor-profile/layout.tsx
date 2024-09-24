import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Investor Profile",
    description: "View and manage your investor profile.",
  };

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
        {children}
    </main>
  );
};

export default Layout;
