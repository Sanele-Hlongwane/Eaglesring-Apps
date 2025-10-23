import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Investment successful",
  description:
    "You have successfully invested. Thank you for using our platform!",
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
