import { Metadata } from "next";
import { ReactNode } from "react";

import StreamVideoProvider from '@/providers/StreamClientProvider';

export const metadata: Metadata = {
    title: "Current Meeting Active",
    description: "Join and manage your current active meetings.",
  };

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
        <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default Layout;
