// app/admin/layout.tsx
'use client'; // Corrected: Must be 'use client' for useState

import { ReactNode, useState } from 'react';
import AdminSidebar from '@/components/layout/admin-sidebar';
import AdminHeader from '@/components/layout/admin-header';
import { SessionProvider } from 'next-auth/react';
import { Sheet } from '@/components/ui/sheet'; // Import Sheet component here

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // The Sheet component now wraps the entire layout to provide context
    <SessionProvider>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <div className="flex min-h-screen bg-gray-100">
          {/* Desktop Sidebar (visible on md screens and up) */}
          <AdminSidebar /> 

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header, which will contain the mobile SheetTrigger */}
            <AdminHeader />
            
            {/* Page Content */}
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </Sheet>
    </SessionProvider>
  );
}