import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../lib/db';

async function main() {
  const passwordHash = await bcrypt.hash('Suscripciones8778!', 10);
  await prisma.user.upsert({
    where: { email: 'subscripcion.info@gmail.com' },
    update: {},
    create: {
      email: 'subscripcion.info@gmail.com',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log('Admin user ensured');
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
