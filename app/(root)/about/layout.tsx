import { Metadata } from "next";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "About",
  description: "Read all about Eagles Ring.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <Navbar />
      <div className="w-full m-5">{children}</div>
      <Footer />
    </main>
  );
};

export default Layout;
