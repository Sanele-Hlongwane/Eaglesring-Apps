import { Metadata } from 'next';
import { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/navbar';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Pitches',
  description: 'Find and connect with entrepreneurs.',
};

const Layout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <main >
        <section className="w-full">
          <div className="w-full text-xs md:s">{children}</div>
        </section>
    </main>
  );
};

export default Layout;