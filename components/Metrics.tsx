import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { Gauge, Search, Shield } from 'lucide-react';

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

const stats: Stat[] = [
  { icon: Gauge, value: '99', label: 'Rendimiento' },
  { icon: Search, value: '98', label: 'SEO' },
  { icon: Shield, value: '100', label: 'Mejores prácticas' }
];

export function Metrics() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]">
      <div className="grid gap-8 md:grid-cols-3">
        {stats.map(s => (
          <Card key={s.label} className="text-center">
            <CardContent className="flex flex-col items-center p-6">
              <s.icon className="mb-2 h-8 w-8 text-zinc-600" aria-hidden />
              <p className="text-4xl font-bold">{s.value}</p>
              <p className="text-sm text-zinc-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
