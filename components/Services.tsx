import { prisma } from '@/lib/db';
import { Code, Globe, Layers } from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';

export async function Services() {
  let servicios: Array<{ id: string; name: string; description: string | null }> = [];
  try {
    servicios = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  } catch {
    servicios = [];
  }
  const icons = [Code, Globe, Layers];
  return (
    <section id="servicios" className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]">
      <h2 className="mb-12 text-center text-3xl font-serif">Servicios</h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {servicios.map((s, i) => (
          <ServiceCard key={s.id} icon={icons[i % icons.length]} title={s.name} description={s.description} />
        ))}
        {servicios.length === 0 && <p>No hay servicios disponibles.</p>}
      </div>
    </section>
  );
}
