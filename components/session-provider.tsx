// components/session-provider.tsx
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
// FIX: Import the EdgeStoreProvider
import { EdgeStoreProvider } from '@/lib/edgestore-client'; 

interface Props {
  children: ReactNode;
  // Optional: when omitted/undefined the SessionProvider auto-fetches the
  // session via the /api/auth session endpoint (client-side). Used by the now
  // static root layout; admin pages keep working unchanged via client fetch.
  session?: any;
}

export function SessionProvider({ children, session }: Props) {
  return (
    <NextAuthSessionProvider session={session}>
      {/* FIX: Wrap children with EdgeStoreProvider */}
      <EdgeStoreProvider>
          {children}
      </EdgeStoreProvider>
    </NextAuthSessionProvider>
  );
}