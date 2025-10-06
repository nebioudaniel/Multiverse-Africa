// types/next-auth.d.ts (or types/index.d.ts if you prefer, but next-auth.d.ts is conventional)
import NextAuth from "next-auth"
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name?: string | null; // Add name (from admin.fullName)
      email?: string | null; // Add email
      image?: string | null;
      role: string; // "MAIN_ADMIN" | "REGISTRAR_ADMIN"
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string; // "MAIN_ADMIN" | "REGISTRAR_ADMIN"
    fullName?: string | null; // Add fullName if you want it directly on the User type
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    id: string;
    role: string; // "MAIN_ADMIN" | "REGISTRAR_ADMIN"
    name?: string | null; // Add name to JWT
    email?: string | null; // Add email to JWT
  }
}