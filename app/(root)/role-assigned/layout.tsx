import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Role Assigned",
  description:
    "Congratulations on taking the next step. Your role has been successfully assigned, and you're ready to begin your journey with Eagles Ring.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="relative w-full min-h-screen">
      <div className="flex w-full min-h-screen">
        <section className="flex w-full flex-col justify-center items-center min-h-screen">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
