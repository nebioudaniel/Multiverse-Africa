// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

// Declare a global variable to store the PrismaClient instance in development
// This prevents hot-reloading from creating new instances on every reload
declare global {
  // Line 7 has been deleted
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // In production, always create a new instance
  prisma = new PrismaClient();
} else {
  // In development, use the global instance if it exists, otherwise create one
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;