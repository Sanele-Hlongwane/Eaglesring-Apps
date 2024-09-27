'use client';

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { SignInButton, SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from 'next/image';
import eagleSvg from '@/public/images/EaglesRingLogo.png';
import { usePathname } from 'next/navigation'; // Updated import
import router from "next/router";

export const Navbar = () => {
  const [role, setRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.matchMedia('(max-width: 768px)').matches);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch('/api/get-user-role');
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error('Failed to fetch user role', error);
        setRole(null);
      }
    }

    fetchUserRole();
  }, []);

  const handleLinkClick = (href: string) => {
    if (isSmallScreen && menuOpen) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  const getLinkClasses = (href: string) => {
    return `text-sm font-bold navbar-link ${
      pathname === href
        ? 'active text-black dark:text-white font-bold' 
        : 'text-gray-600 dark:text-gray-300'
    }`;
  };

  const roleBasedOptions = (role: string | null) => {
    switch (role) {
      case 'INVESTOR':
        return (
          <>
            <NavbarMenuItem>
              <Link className={getLinkClasses('/')} href="/" onClick={() => handleLinkClick('/')}>
                Dashboard
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className={getLinkClasses('/notifications')} href="/notifications" onClick={() => handleLinkClick('/notifications')}>
                Notifications
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className={getLinkClasses('/meetings')} href="/meetings" onClick={() => handleLinkClick('/meetings')}>
                Meetings
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
          <Link className={getLinkClasses('/friend-requests')} href="/friend-requests" onClick={() => handleLinkClick('/friend-requests')}>
            Connections
          </Link>
        </NavbarMenuItem>
          </>
        );
      case 'ENTREPRENEUR':
        return (
          <>
            <NavbarMenuItem>
              <Link className={getLinkClasses('/')} href="/" onClick={() => handleLinkClick('/')}>
                Dashboard
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className={getLinkClasses('/notifications')} href="/notifications" onClick={() => handleLinkClick('/notifications')}>
                Notifications
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className={getLinkClasses('/pitches')} href="/pitches" onClick={() => handleLinkClick('/pitches')}>
                Pitches
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className={getLinkClasses('/meetings')} href="/meetings" onClick={() => handleLinkClick('/meetings')}>
                Meetings
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className={getLinkClasses('/friend-requests')} href="/friend-requests" onClick={() => handleLinkClick('/friend-requests')}>
                Connections
              </Link>
            </NavbarMenuItem>
          </>
        );
      default:
        return null;
    }
  };

  const commonLinks = (
    <>
    <SignedOut>
       <NavbarMenuItem>
        <Link className={getLinkClasses('/')} href="/" onClick={() => handleLinkClick('/')}>
          Home
        </Link>
      </NavbarMenuItem>
      <NavbarMenuItem>
        <Link className={getLinkClasses('/about')} href="/about" onClick={() => handleLinkClick('/about')}>
          About
        </Link>
      </NavbarMenuItem>
      <NavbarMenuItem>
        <Link className={getLinkClasses('/pricing')} href="/pricing" onClick={() => handleLinkClick('/pricing')}>
          Pricing
        </Link>
      </NavbarMenuItem>
      </SignedOut>
    </>
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky" className="bg-gray-300 dark:bg-gray-900">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-1" href="/">
            <Image 
              src={eagleSvg} 
              alt="Eagle Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 invert-on-dark" 
            />
          </Link>
        </NavbarBrand>

        <ul className="hidden lg:flex gap-2 justify-start ml-2">
          <SignedIn>
            {roleBasedOptions(role)}
          </SignedIn>
          <SignedOut>
            {commonLinks}
          </SignedOut>
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button
                className="text-lg font-semibold rounded-lg px-4 py-2 transition-all duration-300 ease-in-out bg-gradient-to-r from-green-500 to-green-500 text-gray-100 shadow-lg hover:from-green-600 hover:to-green-600 dark:bg-gradient-to-r dark:from-green-800 dark:to-green-800 dark:text-gray-100 dark:hover:from-green-900 dark:hover:to-green-900 focus:outline-none"
                type="button"
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </NavbarItem>
        
        <NavbarItem className="hidden md:flex">
          <SignedIn>
            <SignOutButton>
              <button
                className="text-lg font-semibold rounded-lg px-4 py-2 transition-all duration-300 ease-in-out bg-gradient-to-r from-red-500 to-red-500 text-gray-100 shadow-lg hover:from-red-600 hover:to-red-600 dark:bg-gradient-to-r dark:from-red-800 dark:to-red-800 dark:text-gray-100 dark:hover:from-red-900 dark:hover:to-red-900 focus:outline-none"
                type="button"
              >
                Log Out
              </button>
            </SignOutButton>
          </SignedIn>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <SignedIn>
          <UserButton />
          
        </SignedIn>
          <SignedOut>
            <SignInButton>
              <button
                className="text-lg font-semibold rounded-lg px-4 py-2 transition-all duration-300 ease-in-out bg-gradient-to-r from-green-500 to-green-500 text-gray-100 shadow-lg hover:from-green-600 hover:to-green-600 dark:bg-gradient-to-r dark:from-green-800 dark:to-green-800 dark:text-gray-100 dark:hover:from-green-900 dark:hover:to-green-900 focus:outline-none"
                type="button"
              >
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <ThemeSwitch />
        <NavbarMenuToggle onClick={() => setMenuOpen(!menuOpen)} />
      </NavbarContent>

      {menuOpen && (
        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-1">
            <SignedIn>
              {roleBasedOptions(role)}
              <NavbarMenuItem>
                
              </NavbarMenuItem>
            </SignedIn>
            <SignedOut>
              {commonLinks}
            </SignedOut>
          </div>
        </NavbarMenu>
      )}
    </NextUINavbar>
  );
};
