import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Find and connect with entrepreneurs.',
};

const Layout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <main>
        <div className="w-full">{children}</div>
    </main>
  );
};

export default Layout;