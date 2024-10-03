import { ReactNode } from "react";

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return <main className="text-xs md:text-base font-roboto">{children}</main>;
};

export default RootLayout;
