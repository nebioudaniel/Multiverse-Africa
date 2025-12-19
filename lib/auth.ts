// lib/auth.ts
import NextAuth from "next-auth/next"; // 👈 Change this line
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

// Use : any to bypass the "No exported member" build errors
export const authOptions: any = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const admin = await prisma.admin.findUnique({
          where: { email: email },
        });

        if (!admin || !admin.passwordHash) return null;

        const isValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isValid) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: admin.fullName,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

// 👈 Final export change:
const handler = NextAuth(authOptions);
export default handler;