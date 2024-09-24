import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Select Your Role",
  description:
    "Choose your path as an entrepreneur or investor. Define your journey and unlock tailored experiences designed for your success.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="relative w-full min-h-screen">
      <div className="flex w-full min-h-screen justify-center items-center">
        <section className="flex w-full max-w-4xl flex-col justify-center items-center p-8 ">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
