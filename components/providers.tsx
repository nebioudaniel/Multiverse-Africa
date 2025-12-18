// ./components/providers.tsx

'use client'; // ⬅️ THIS IS THE CRITICAL FIX

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// Assuming you are using next-auth/react for session management
// and potentially other providers (like state/theme context)
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Wrap any context providers here. NextAuth's SessionProvider is a common one.
    <SessionProvider> 
        {/* If you have other providers (like a ThemeProvider or Redux Provider), wrap them here: */}
        {children}
    </SessionProvider>
  );
}