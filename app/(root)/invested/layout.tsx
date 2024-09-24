import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Invested",
    description: "You have successfully invested. Thank you for using our platform!",
  };

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
        {children}
    </main>
  );
};

export default Layout;
