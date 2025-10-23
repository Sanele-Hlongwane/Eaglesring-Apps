import { Metadata } from "next";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Find and connect with entrepreneurs.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="">
      <Navbar />
      <div className=" m-5">{children}</div>
      <Footer />
    </main>
  );
};

export default Layout;
