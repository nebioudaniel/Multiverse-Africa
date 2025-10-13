// ✅ RECOMMENDED: Use Neon Driver Adapter for Edge compatibility

import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

// 1. Check for DATABASE_URL
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

// 2. Declare a global variable for PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// 3. Instantiate Neon's Pool and the Prisma Adapter
const neon = new Pool({ connectionString });
const adapter = new PrismaNeon(neon);

// 4. Create an Edge-compatible Prisma Client instance
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  // In development, reuse the global instance if it exists
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter }); // Pass the adapter here!
  }
  prisma = global.prisma;
}

export default prisma;