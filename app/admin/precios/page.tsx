import { prisma } from '@/lib/db';

export const revalidate = 0;

export default async function Precios() {
  const servicios = await prisma.service.findMany({
    include: { prices: { orderBy: { activeFrom: 'desc' } } },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="bg-white p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Precios</h1>
      {servicios.map(s => {
        const current = s.prices.find(p => p.isCurrent);
        return (
          <div key={s.id} className="mb-8">
            <h2 className="text-xl font-semibold">{s.name}</h2>
            <p className="mb-2">Precio vigente: {current ? `${current.currency} ${(current.amountCents/100).toFixed(2)}` : 'No definido'}</p>
            <a className="text-blue-600 underline" href={`/admin/precios/${s.id}`}>Cambiar precio</a>
          </div>
        );
      })}
    </div>
  );
}
