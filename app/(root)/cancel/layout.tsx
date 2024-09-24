import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Cancelled",
    description: "Your investment was cancelled!",
  };

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
        {children}
    </main>
  );
};

export default Layout;
