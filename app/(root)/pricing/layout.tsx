import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Find the best pricing plan that fits your needs.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <div className="w-full">{children}</div>
    </main>
  );
};

export default Layout;
