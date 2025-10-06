// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { locales, localeNames, defaultLocale } from '@/i18n/locales';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentLocale = pathname.split('/')[1] || defaultLocale;
  const displayLocale = locales.includes(currentLocale as any)
    ? currentLocale
    : defaultLocale;

  const changeLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.startsWith(`/${displayLocale}`)
      ? pathname.substring(`/${displayLocale}`.length)
      : pathname;

    const finalPathWithoutLocale = pathWithoutLocale.startsWith('/')
      ? pathWithoutLocale
      : `/${pathWithoutLocale}`;

    router.push(`/${newLocale}${finalPathWithoutLocale}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 z-50 flex justify-center px-4 py-3 bg-transparent">
      <div className="flex w-full max-w-7xl items-center justify-between rounded-full border bg-white px-6 py-2 shadow-sm">
        {/* Logo */}
        <Link href={`/${displayLocale}`} className="flex items-center">
          <Image
            src="/h.png"
            width={120}
            height={50}
            alt="Logo"
            className="h-auto w-auto"
          />
        </Link>

        {/* Desktop Language Switcher */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full px-4 text-sm font-medium">
                {localeNames[displayLocale]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
              {locales.map((locale) => (
                <DropdownMenuItem
                  key={locale}
                  onClick={() => changeLocale(locale)}
                >
                  {localeNames[locale]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-700 hover:text-green-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Language Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[70px] w-full px-4 md:hidden">
          <div className="rounded-xl border bg-white p-3 shadow-lg">
            {locales.map((locale) => (
              <Button
                key={locale}
                variant="outline"
                className="mb-2 w-full rounded-full"
                onClick={() => changeLocale(locale)}
              >
                {localeNames[locale]}
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
