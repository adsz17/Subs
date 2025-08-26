import { prisma } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 0;

export default async function ServiciosPage() {
  const servicios = await prisma.service.findMany({
    where: { isActive: true },
    include: { prices: { where: { isCurrent: true }, take: 1 } },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Servicios</h1>
      <table>
        <thead><tr><th>Servicio</th><th>Precio</th></tr></thead>
        <tbody>
          {servicios.map(s => {
            const p = s.prices[0];
            const price = p ? `${p.currency} ${(p.amountCents/100).toFixed(2)}` : 'Sin precio';
            return (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4"><Link className="btn" href="/">Volver</Link></div>
    </div>
  );
}
