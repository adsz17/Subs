import { prisma } from '../lib/db';

async function main() {
  const s1 = await prisma.service.create({ data: { slug: 'landing-pro', name: 'Landing Pro', description: 'Landing page optimizada' } });
  const s2 = await prisma.service.create({ data: { slug: 'ecommerce-mini', name: 'Ecommerce Mini', description: 'Catálogo + checkout' } });
  const s3 = await prisma.service.create({ data: { slug: 'seo-pack', name: 'SEO Pack', description: 'Optimización SEO' } });
  const now = new Date();
  await prisma.price.createMany({
    data: [
      { serviceId: s1.id, currency: 'USD', amountCents: 9900, activeFrom: now, isCurrent: true },
      { serviceId: s2.id, currency: 'USD', amountCents: 19900, activeFrom: now, isCurrent: true },
      { serviceId: s3.id, currency: 'USD', amountCents: 14900, activeFrom: now, isCurrent: true }
    ]
  });
  console.log('Seed done');
}

main().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1); });
