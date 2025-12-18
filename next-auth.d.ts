import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // or "AdminRole" if you want strong typing
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
  }
}