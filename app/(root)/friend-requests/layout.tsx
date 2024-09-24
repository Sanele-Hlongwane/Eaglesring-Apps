import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Active Meeting",
  description: "Join and manage your active meetings.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
        {children}
    </main>
  );
};

export default Layout;
