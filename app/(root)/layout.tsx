import { ReactNode } from 'react';

import StreamVideoProvider from '@/providers/StreamClientProvider';

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className='text-xs md:s'>
      {children}
    </main>
  );
};

export default RootLayout;