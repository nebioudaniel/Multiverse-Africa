// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
// Assuming this provides locales: string[] and localeNames: Record<string, string>
// The error suggests that 'locales' is inferred as string[] but the type of its items is strictly '"am" | "en"'
import { locales, localeNames, defaultLocale } from '@/i18n/locales'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

// Define a type for your valid locales based on your i18n setup
// This must match the literal strings in your 'locales' array from '@/i18n/locales'
type Locale = typeof locales[number]; 
// Assuming this resolves to: type Locale = "am" | "en";

// Define a type for the segment (it's potentially a locale or just a path segment)
type SegmentType = Locale | string;


export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Extract the potential locale from the path
  const pathParts = pathname.split('/');
  
  // The first path segment is generally a generic string:
  const segmentLocale: SegmentType = pathParts[1] || ''; // Initialize as string

  // FIX: Typecast segmentLocale to the array element type when calling includes().
  // This tells TypeScript to trust that `segmentLocale` *might* be a valid Locale type.
  const currentLocale = locales.includes(segmentLocale as Locale) 
    ? segmentLocale as Locale // Type assertion is safe after checking includes()
    : defaultLocale as Locale; 
    
  // Use the valid locale for display
  const displayLocale = currentLocale;


  const changeLocale = (newLocale: string) => {
    // We can safely treat newLocale as Locale here because it comes from the locales map/array
    const newLocaleTyped = newLocale as Locale; 
    
    // 1. Get the path *without* the current locale prefix
    const pathWithoutLocale = pathname.startsWith(`/${displayLocale}`)
      ? pathname.substring(`/${displayLocale}`.length)
      : pathname;

    // 2. Ensure it starts with a slash
    const finalPathWithoutLocale = pathWithoutLocale.startsWith('/')
      ? pathWithoutLocale
      : `/${pathWithoutLocale}`;

    // 3. Navigate to the new locale path
    router.push(`/${newLocaleTyped}${finalPathWithoutLocale}`);
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
                  // New locale is passed as string, but handled correctly inside changeLocale
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