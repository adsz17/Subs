import bcrypt from 'bcryptjs';
import { PaymentProvider, Role } from '@prisma/client';
import { prisma } from '../lib/db';

async function main() {
  // Setting with defaults
  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      paymentProvider: PaymentProvider.COINBASE,
      defaultCurrency: 'USD',
      cryptoNetwork: 'Ethereum',
      walletAddress: '',
      qrCodeUrl: ''
    }
  });
  // Payments config
  await prisma.paymentsConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      network: "TRON-TRC20",
      wallet: "",
      provider: "manual"
    }
  });


  // Admin user
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      passwordHash,
      role: Role.ADMIN
    }
  });

  const subsPasswordHash = await bcrypt.hash('Suscripciones8778!', 10);
  await prisma.user.upsert({
    where: { email: 'subscripcion.info@gmail.com' },
    update: {},
    create: {
      email: 'subscripcion.info@gmail.com',
      passwordHash: subsPasswordHash,
      role: Role.ADMIN
    }
  });

  // Example services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { slug: 'landing-pro' },
      update: {},
      create: {
        slug: 'landing-pro',
        name: 'Landing Pro',
        description: 'Landing page optimizada'
      }
    }),
    prisma.service.upsert({
      where: { slug: 'ecommerce-mini' },
      update: {},
      create: {
        slug: 'ecommerce-mini',
        name: 'Ecommerce Mini',
        description: 'Catálogo + checkout'
      }
    }),
    prisma.service.upsert({
      where: { slug: 'seo-pack' },
      update: {},
      create: {
        slug: 'seo-pack',
        name: 'SEO Pack',
        description: 'Optimización SEO'
      }
    })
  ]);

  const now = new Date();
  await prisma.price.createMany({
    data: [
      { serviceId: services[0].id, currency: 'USD', amountCents: 9900, activeFrom: now, isCurrent: true },
      { serviceId: services[1].id, currency: 'USD', amountCents: 19900, activeFrom: now, isCurrent: true },
      { serviceId: services[2].id, currency: 'USD', amountCents: 14900, activeFrom: now, isCurrent: true }
    ],
    skipDuplicates: true
  });

  // Welcome coupon
  await prisma.coupon.upsert({
    where: { code: 'BIENVENIDA10' },
    update: {},
    create: {
      code: 'BIENVENIDA10',
      percentage: 10,
      validFrom: now
    }
  });

  console.log('Seed done');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
