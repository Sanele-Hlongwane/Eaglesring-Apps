import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Connections",
  description: "Send, accept and manage your onnections.",
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
        {children}
    </main>
  );
};

export default Layout;
