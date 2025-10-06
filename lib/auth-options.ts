// lib/auth-options.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaAdapter } from '@next-auth/prisma-adapter'; // If using Prisma Adapter
// import prisma from './prisma'; // Your Prisma client

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Uncomment if using Prisma Adapter
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Your authentication logic here
        // Example: Fetch user from DB, compare password
        // This is a simplified example, use your actual user/admin model
        const user = await prisma.admin.findUnique({ where: { email: credentials?.email } });

        if (user && credentials?.password && await bcrypt.compare(credentials.password, user.hashedPassword)) {
          // Any object returned will be saved in `session.user` and accessible on the client
          return {
            id: user.id,
            email: user.email,
            name: user.fullName, // Or whatever field holds the name
            role: user.role, // Make sure your user object includes a role
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user role to the token
        token.id = user.id;
        token.role = (user as any).role; // Cast to any to access custom role property
        token.fullName = (user as any).name; // Add full name to token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Add user role from token to session
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.fullName = token.fullName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login', // Redirect to your custom login page
    // error: '/auth/error', // Optional: Redirect to an error page
  },
  // ... other NextAuth.js options
};