import { Metadata } from 'next';
import { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/navbar';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Pitches Management',
  description: 'Find and connect with entrepreneurs.',
};

const Layout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <main>

      <div className="flex">
          <div className="w-full">{children}</div>
      </div>
    </main>
  );
};

export default Layout;