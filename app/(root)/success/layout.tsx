import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Success Subscribed",
    description: "You have successfully subscribed. Thank you for joining us!",
  };

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
        {children}
    </main>
  );
};

export default Layout;
