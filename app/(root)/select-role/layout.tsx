import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Select Your Role",
  description:
    "Choose your path as an entrepreneur or investor. Define your journey and unlock tailored experiences designed for your success.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <div className="w-full">{children}</div>
    </main>
  );
};

export default Layout;
