import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import { ReactNode } from "react";


export const metadata: Metadata = {
    title: "Terms and Conditions",
    description: "Review the terms and conditions for using our platform.",
  };

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="">
      <Navbar />
      <div className="w-full m-5">{children}</div>
      <Footer />
    </main>
  );
};

export default Layout;
