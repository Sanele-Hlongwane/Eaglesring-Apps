"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Import icons from react-icons
import {
  FaHome,
  FaChartLine,
  FaBell,
  FaUser,
  FaDollarSign,
} from "react-icons/fa";

// Define sidenavLinks with react-icons
export const sidenavLinks = [
  {
    imgURL: FaHome, // Overview icon
    route: "/lol",
    label: "Overview",
  },
  {
    imgURL: FaDollarSign, // My Investments icon
    route: "/investments",
    label: "My Investments",
  },
  {
    imgURL: FaChartLine, // Performance Metrics icon
    route: "/performance",
    label: "Performance Metrics",
  },
  {
    imgURL: FaBell, // Notifications icon
    route: "/notifications",
    label: "Notifications",
  },
  {
    imgURL: FaUser, // Profile icon
    route: "/profile",
    label: "Profile",
  },
];

interface TabProps {
  label: string;
  route: string;
  imgURL: React.FC<React.SVGProps<SVGSVGElement>>; // Type the imgURL as a React Functional Component
  isActive: boolean; // Add isActive prop
  onClick: () => void;
}

export const Tab: React.FC<TabProps> = ({
  label,
  route,
  imgURL: Icon,
  isActive,
  onClick,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-center px-4 py-2 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105",
        {
          "bg-gradient-to-r from-blue-500 to-blue-700 text-white dark:bg-gradient-to-r dark:from-blue-400 dark:to-blue-600 dark:text-black shadow-lg":
            isActive,
          "hover:bg-blue-800 text-gray-300": !isActive,
        },
      )}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <Link href={route} passHref>
        <div className="flex flex-col items-start">
          <Icon className="mb-1 text-xl text-black dark:text-white" />
          <p className="text-xs font-semibold text-black dark:text-white">
            {label}
          </p>{" "}
          {/* Smaller text size */}
        </div>
      </Link>
    </div>
  );
};

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const pathname = usePathname(); // Get the current pathname

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
          "top-0 left-0 h-full bg-gray-400 dark:bg-gray-800 text-white pt-5 ",
          {
            "w-20 lg:w-64": isOpen,
            "w-20 ": !isOpen,
          },
        )}
        role="navigation"
      >
        <div className="flex flex-col text-xs mt-5 space-y-1">
          {sidenavLinks.map(({ label, imgURL, route }, index) => (
            <Tab
              key={index}
              label={label}
              route={route}
              imgURL={imgURL} // Pass the icon component
              isActive={pathname === route} // Pass the active state
              onClick={() => setIsOpen(false)} // Close sidebar on small screens when a tab is clicked
            />
          ))}
        </div>
      </div>

      {/* Background overlay on small screens */}
      {!isOpen && screenWidth < 1024 && (
        <div
          className="top-0 left-0 w-full h-full bg-black opacity-70 "
          role="button"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default SideNav;
