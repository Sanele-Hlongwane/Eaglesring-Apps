import { Metadata } from "next";
import { ReactNode } from "react";


export const metadata: Metadata = {
    title: "Terms and Conditions",
    description: "Review the terms and conditions for using our platform.",
  };

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
        {children}
    </main>
  );
};

export default Layout;
