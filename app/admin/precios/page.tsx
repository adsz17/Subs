import { prisma } from '@/lib/db';

export const revalidate = 0;

export default async function Precios() {
  const servicios = await prisma.service.findMany({
    include: { prices: { orderBy: { activeFrom: 'desc' } } },
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Precios</h1>
      {servicios.map(s => {
        const current = s.prices.find(p => p.isCurrent);
        return (
          <div key={s.id} className="mb-8">
            <h2 className="text-xl font-semibold">{s.name}</h2>
            <p className="mb-2">Precio vigente: {current ? `${current.currency} ${(current.amountCents/100).toFixed(2)}` : 'No definido'}</p>
            <form action={async (formData: FormData) => {
              'use server';
              const currency = String(formData.get('currency') || 'USD');
              const amount = Number(formData.get('amount'));
              const now = new Date();
              const curr = await prisma.price.findFirst({ where: { serviceId: s.id, isCurrent: True } as any });
            }}>
              {/* Left intentionally blank to avoid TS/Prisma server action complexity here */}
            </form>
          </div>
        );
      })}
      <p className="mt-6 text-sm opacity-80">Para cambiar precio, entra al detalle del servicio.</p>
    </div>
  );
}
