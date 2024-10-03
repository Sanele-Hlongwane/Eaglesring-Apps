import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Role Assigned",
  description:
    "Congratulations on taking the next step. Your role has been successfully assigned, and you're ready to begin your journey with Eagles Ring.",
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
