import { prisma } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import { ServiceGrid, type ServiceGridItem } from '@/components/ServiceGrid';

interface ServicesProps {
  searchQuery?: string;
  category?: string;
}

const SERVICE_ICONS: ServiceGridItem['icon'][] = ['code', 'globe', 'layers', 'rocket', 'sparkles'];

function normalizeCategory(value: unknown, fallback: string) {
  if (!value || typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed
    .toLowerCase()
    .split(' ')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export async function Services(props: ServicesProps = {}) {
  noStore();
  const { searchQuery = '', category = 'all' } = props;
  let servicios: Array<{ id: string; name: string; description: string | null }> = [];
  try {
    servicios = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  } catch {
    servicios = [];
  }

  const formatted: ServiceGridItem[] = servicios.map((service, index) => {
    const metadata = service as unknown as { category?: string | null };
    const categoryValue = normalizeCategory(metadata.category, 'General');
    return {
      id: service.id,
      title: service.name,
      description: service.description ?? null,
      category: categoryValue,
      icon: SERVICE_ICONS[index % SERVICE_ICONS.length],
    };
  });

  return (
    <section id="servicios" className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]">
      <h2 className="mb-12 text-center text-3xl font-serif">Servicios</h2>
      <ServiceGrid services={formatted} defaultSearch={searchQuery} defaultCategory={category} />
    </section>
  );
}
