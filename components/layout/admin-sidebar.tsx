// components/layout/admin-sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image'; // Import the Image component for optimized images
import {
  Home,
  Users,
  UserCog,
  FileText,
  User,
  LogOut,
  X,
  ClipboardList, // New icon for Activity Log
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetContent, SheetClose } from '@/components/ui/sheet';
import { signOut } from 'next-auth/react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;

  const navItems = [
    {
      href: '/admin/dashboard',
      icon: <Home className="h-4 w-4" />,
      label: 'Overview',
      roles: ['MAIN_ADMIN', 'REGISTRAR_ADMIN'],
    },
    {
      href: '/admin/users',
      icon: <Users className="h-4 w-4" />,
      label: 'Applicants',
      // UPDATED: REGISTRAR_ADMIN can now see Applicants
      roles: ['MAIN_ADMIN', 'REGISTRAR_ADMIN'], 
    },
    {
      href: '/admin/admins',
      icon: <UserCog className="h-4 w-4" />,
      label: 'Administrators',
      roles: ['MAIN_ADMIN'],
    },
    {
      href: '/admin/applications',
      icon: <FileText className="h-4 w-4" />,
      label: 'Applications',
      roles: ['MAIN_ADMIN', 'REGISTRAR_ADMIN'],
    },
    // New: Activity Log for MAIN_ADMIN
    {
      href: '/admin/activity',
      icon: <ClipboardList className="h-4 w-4" />,
      label: 'Activity Log',
      roles: ['MAIN_ADMIN'], // Only MAIN_ADMIN can see this
    },
    {
      href: `/admin/profile/`,
      icon: <User className="h-4 w-4" />,
      label: 'My Profile',
      roles: ['MAIN_ADMIN', 'REGISTRAR_ADMIN'],
    },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (status === 'loading' || !userRole) return false;
    return item.roles.includes(userRole);
  });

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Top Section: Replaced "ADMIN PANEL" text with the image */}
      <div className="flex items-center justify-between py-4 px-4 border-b border-gray-100">
        <Link href="/admin/dashboard" className="flex items-center">
          <Image
            src="/h.png" // Path to your image in the public folder
            alt="Admin Dashboard Logo"
            width={120} // Adjust width as needed
            height={30} // Adjust height as needed, maintaining aspect ratio
            className="h-auto" // Ensure responsive height
            priority // Prioritize loading for this important image
          />
        </Link>
        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </SheetClose>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 px-2 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href.includes('/profile') && pathname.includes('/profile')) ||
            (item.href.includes('/activity') && pathname.includes('/activity'));

          return (
            <Link href={item.href} key={item.href}>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm font-medium py-2 px-3 rounded-md transition-all duration-150
                    ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                    {item.icon}
                  </span>
                  <span className="ml-2.5">{item.label}</span>
                </Button>
              </SheetClose>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: Logout */}
      <div className="mt-auto px-2 py-3 border-t border-gray-100">
        <SheetClose asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-medium py-2 px-3 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span className="ml-2.5">Sign Out</span>
          </Button>
        </SheetClose>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[200px] border-r border-gray-100 bg-white">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <SheetContent side="left" className="w-[200px] p-0">
        {sidebarContent}
      </SheetContent>
    </>
  );
}