'use client';

import { useMemo, useState } from 'react';
import { Code, Globe, Layers, Rocket, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { EmptyPlaceholder } from '@/components/EmptyPlaceholder';

const ICON_MAP = {
  code: Code,
  globe: Globe,
  layers: Layers,
  rocket: Rocket,
  sparkles: Sparkles,
} satisfies Record<string, LucideIcon>;

type IconKey = keyof typeof ICON_MAP;

export interface ServiceGridItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  icon: IconKey;
  href?: string;
}

interface ServiceGridProps {
  services: ServiceGridItem[];
  defaultSearch?: string;
  defaultCategory?: string;
}

export function ServiceGrid({ services, defaultSearch = '', defaultCategory = 'all' }: ServiceGridProps) {
  const categories = useMemo(() => {
    const unique = new Set<string>();
    services.forEach(service => {
      if (service.category) {
        unique.add(service.category);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [services]);

  const normalizedDefault = categories.includes(defaultCategory) ? defaultCategory : 'all';
  const [search, setSearch] = useState(defaultSearch);
  const [category, setCategory] = useState(normalizedDefault);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return services.filter(service => {
      const matchesCategory = category === 'all' || service.category === category;
      const matchesSearch =
        query.length === 0 ||
        service.title.toLowerCase().includes(query) ||
        (service.description ?? '').toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [services, search, category]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Buscar servicios..."
          className="md:max-w-sm"
        />
        <Select value={category} onChange={event => setCategory(event.target.value)} className="md:w-52">
          <option value="all">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map(service => {
          const Icon = ICON_MAP[service.icon] ?? ICON_MAP.code;
          return (
            <ServiceCard
              key={service.id}
              icon={Icon}
              title={service.title}
              description={service.description}
              category={service.category}
              href={service.href}
            />
          );
        })}
        {filtered.length === 0 && (
          <EmptyPlaceholder
            title="Aún no hay servicios publicados"
            description="Crea tu primer servicio desde el panel de administración para destacarlo aquí."
            href="/admin/servicios/nuevo"
            actionLabel="Crear servicio"
          />
        )}
      </div>
    </div>
  );
}
