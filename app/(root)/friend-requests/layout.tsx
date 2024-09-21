import { Metadata } from 'next';
import { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/navbar';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Connections',
  description: 'Find and connect with entrepreneurs.',
};

const Layout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <main className='w-full'>

          <div className='w-full'>{children}</div>
    </main>
  );
};

export default Layout;