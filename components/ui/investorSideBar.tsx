'use client';
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { sidebarLinks } from '@/constants';
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TabProps {
  label: string;
  route: string;
  imgURL: string;
  onClick: () => void;
}

export const Tab: React.FC<TabProps> = ({ label, route, imgURL, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === route;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-2 cursor-pointer transition-all duration-300",
        {
          "bg-primary text-white": isActive,
          "hover:bg-gray-700 text-gray-400": !isActive,
        }
      )}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <Link href={route} passHref>
        <div className="flex flex-col items-center">
          <Image src={imgURL} width={30} height={30} alt={label} className="mb-2" />
          <p className="text-xs lg:text-sm font-medium">{label}</p>
        </div>
      </Link>
    </div>
  );
};

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Initialize with current width

  const updateScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateScreenWidth);
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  useEffect(() => {
    setIsOpen(screenWidth >= 1024);
  }, [screenWidth]);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div
        className={cn(
          "top-0 left-0 h-full bg-gray-900 text-white pt-5 transition-all duration-300",
          {
            "w-16 lg:w-64": isOpen,
            "w-16": !isOpen,
          }
        )}
        role="navigation"
      >
        <div className="flex flex-col mt-5 space-y-2">
          {sidebarLinks.map(({ label, imgURL, route }, index) => (
            <Tab
              key={index}
              label={label}
              route={route}
              imgURL={imgURL}
              onClick={() => setIsOpen(false)} // Close sidebar on small screens when a tab is clicked
            />
          ))}
        </div>
      </div>

      {/* Background overlay on small screens */}
      {!isOpen && screenWidth < 1024 && (
        <div
          className="top-0 left-0 w-full h-full bg-black opacity-50 z-30"
          role="button"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default SideNav;
