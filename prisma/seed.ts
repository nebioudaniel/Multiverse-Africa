import { PrismaClient, AdminRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');

  const adminEmail = 'neba1@gmail.com';
  const adminPassword = 'neba123123';

  console.log(`Checking for existing MAIN_ADMIN with email: ${adminEmail}`);

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.admin.create({
      data: {
        fullName: 'Main Admin',
        email: adminEmail,
        passwordHash: hashedPassword,
        role: AdminRole.MAIN_ADMIN,
      },
    });

    console.log(`✅ Main Admin user created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`⚠️ Admin already exists: ${existingAdmin.email}`);
  }

  console.log('Seeding process finished.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
