// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Use a global variable to prevent creating multiple PrismaClient instances 
// in development (due to Next.js Hot Reloading).
declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma