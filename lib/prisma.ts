// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// 1. Declare a global variable for PrismaClient
// This is necessary to avoid hot-reloading issues in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// 2. Check if the global instance already exists (in development)
if (process.env.NODE_ENV === 'production') {
  // In production, always create a new instance
  prisma = new PrismaClient();
} else {
  // In development, reuse the global instance if it exists
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;