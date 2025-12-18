// seed.ts
import { PrismaClient, AdminRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'Test@gmail.com'
  const password = 'test12345'

  const existing = await prisma.admin.findUnique({ where: { email } })
  if (existing) {
    console.log('Admin already exists')
    return
  }

  const hash = await bcrypt.hash(password, 10)
  await prisma.admin.create({
    data: {
      fullName: 'Main Admin',
      email,
      passwordHash: hash,
      role: AdminRole.MAIN_ADMIN,
    },
  })

  console.log('Admin created:', email)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())