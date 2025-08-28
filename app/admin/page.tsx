import { prisma } from '@/lib/db';
import { formatMoney } from '@/lib/format';

export const revalidate = 0;

export default async function AdminDashboard() {
  const [activeServices, prices, recent] = await Promise.all([
    prisma.service.count({ where: { isActive: true } }),
    prisma.price.findMany(),
    prisma.service.findMany({ orderBy: { updatedAt: 'desc' }, take: 5 })
  ]);
  const average = prices.length
    ? prices.reduce((sum, p) => sum + p.amountCents, 0) / prices.length
    : 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Servicios activos</h3>
          <p className="mt-2 text-2xl font-semibold">{activeServices}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Precios totales</h3>
          <p className="mt-2 text-2xl font-semibold">{prices.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Promedio</h3>
          <p className="mt-2 text-2xl font-semibold">{formatMoney(average)}</p>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Últimos editados</h3>
        <ul className="space-y-2">
          {recent.map((s) => (
            <li key={s.id} className="flex justify-between text-sm">
              <span>{s.name}</span>
              <span className="text-gray-500">
                {s.updatedAt.toISOString().slice(0, 10)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
