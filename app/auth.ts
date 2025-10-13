// FIX: Changed import from 'next-auth/next' to the correct 'next-auth' for v5
import NextAuth from "next-auth"; 
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { $Enums } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: { signIn: "/admin/login" },
  // Adapter is now correctly imported from '@auth/prisma-adapter'
  adapter: PrismaAdapter(prisma), 
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });
        if (!admin) return null;

        const isValid = await compare(credentials.password, admin.passwordHash);
        if (!isValid) return null;

        return {
          id: admin.id,
          name: admin.fullName,
          email: admin.email,
          role: admin.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        // Important: Ensure the role property is correctly added to the token
        token.role = (user as any).role; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        // Important: Ensure the role property is correctly added to the session
        (session.user as any).role = token.role; 
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Simplified redirect callback
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === "development",
});
function CredentialsProvider(arg0: { name: string; credentials: { email: { label: string; type: string; }; password: { label: string; type: string; }; }; authorize(credentials: any): Promise<{ id: string; name: string; email: string; role: $Enums.AdminRole; } | null>; }): import("@auth/core/providers").Provider {
  throw new Error("Function not implemented.");
}

