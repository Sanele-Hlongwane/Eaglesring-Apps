import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Success Subscribed",
  description: "You have successfully subscribed. Thank you for joining us!",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <Navbar />
      <div className="w-full">{children}</div>
      <Footer />
    </main>
  );
};

export default Layout;
