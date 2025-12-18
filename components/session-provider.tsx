// components/session-provider.tsx
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
// FIX: Import the EdgeStoreProvider
import { EdgeStoreProvider } from '@/lib/edgestore-client'; 

interface Props {
  children: ReactNode;
  session: any; // ✅ intentionally untyped (required)
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