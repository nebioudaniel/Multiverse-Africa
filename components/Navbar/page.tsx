'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/h.png"
                alt="Company Logo"
                width={130}
                height={50}
                className="rounded-md"
              />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden space-x-4 md:flex md:items-center">
            <Link
              href="/contact"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Contact
            </Link>
            <Link href="/am/register/step1" passHref>
              <Button className=" text-white hover:bg-blue-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 bg-blue-600">
               Minibus Registration / የሚኒባስ ምዝገባ
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-label="Close menu" />
              ) : (
                <Menu className="h-6 w-6" aria-label="Open menu" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-4 px-4 pb-4 pt-2">
            <Link
              href="/our-service"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              Our Service
            </Link>
            <Link
              href="/contact"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              Contact
            </Link>
            <Link href="/am/register/step1" passHref>
              <Button className="w-full bg-blue-600 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100">
                 Minibus Registration / የሚኒባስ ምዝገባ
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;