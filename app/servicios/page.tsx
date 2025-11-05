import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceGrid } from '@/components/ServiceGrid';
import type { ServiceGridItem } from '@/components/ServiceGrid';
import { ServiceCard } from './ServiceCard';

export const revalidate = 0;

export default async function ServiciosPage() {
  const servicios = await prisma.service.findMany({
    where: { isActive: true },
    include: { prices: { where: { isCurrent: true }, take: 1, orderBy: { activeFrom: 'desc' } } },
    orderBy: { name: 'asc' },
  });

  const gridServices: ServiceGridItem[] = servicios.map(service => {
    const category = resolveCategory(service.name, service.description);
    return {
      id: service.id,
      title: service.name,
      description: service.description,
      category: category.name,
      icon: category.icon,
      href: `/servicios/${service.id}`,
    };
  });

  return (
    <div className="space-y-16">
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white">
        <div className="container grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white">Portafolio 2024</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Soluciones digitales hechas para crecer contigo
            </h1>
            <p className="text-lg text-blue-100">
              Integra operaciones, automatiza procesos y ofrece experiencias de primer nivel con un equipo que acompaña todo el
              ciclo de vida del proyecto.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-blue-100/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <Sparkles className="h-4 w-4" aria-hidden /> Lanza MVP en semanas
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <ShieldCheck className="h-4 w-4" aria-hidden /> Seguridad certificada
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="#planes" className="inline-flex items-center gap-2">
                  Ver planes disponibles
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                <Link href="#filtros" className="inline-flex items-center gap-2">
                  Explorar soluciones
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-6 rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div>
                <p className="text-sm text-blue-100/80">Implementaciones activas</p>
                <p className="text-3xl font-semibold">+120</p>
              </div>
              <Badge className="bg-white/20 text-white">SLA 99.9%</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Stat label="Tiempo promedio de onboarding" value="8 días" />
              <Stat label="Clientes enterprise" value="30+" />
              <Stat label="Ahorro operativo" value="hasta 45%" />
              <Stat label="Integraciones activas" value="60" />
            </div>
          </div>
        </div>
      </section>

      <section id="filtros" className="bg-slate-50 py-16">
        <div className="container space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <Badge className="bg-blue-100 text-blue-700">Explora por necesidad</Badge>
              <h2 className="text-3xl font-semibold text-slate-900">Filtra servicios según tus objetivos</h2>
              <p className="text-slate-600">
                Combina categorías, busca por palabra clave y agenda una llamada con nuestro equipo para activar tu siguiente
                iniciativa.
              </p>
            </div>
            <p className="max-w-xs text-sm text-slate-500">
              Las tarjetas muestran un resumen con beneficios destacados y acceso directo a asesoría especializada.
            </p>
          </div>
          <ServiceGrid services={gridServices} />
        </div>
      </section>

      <section id="planes" className="container space-y-8 pb-16">
        <div className="space-y-2">
          <Badge className="bg-blue-100 text-blue-700">Planes recomendados</Badge>
          <h2 className="text-3xl font-semibold text-slate-900">Selecciona el plan que mejor se adapta</h2>
          <p className="text-slate-600">
            Puedes añadir al carrito para iniciar el proceso de compra inmediata o hablar con un especialista para configurar un
            plan híbrido.
          </p>
        </div>
        {servicios.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-slate-500">
            No hay servicios disponibles en este momento. Vuelve pronto para descubrir nuevas soluciones.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {servicios.map(service => {
              const price = service.prices[0] || null;
              return (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  name={service.name}
                  description={service.description}
                  priceCents={price ? price.amountCents : null}
                  currency={price ? price.currency : null}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

const KEYWORD_CATEGORIES: Array<{ keywords: string[]; name: string; icon: ServiceGridItem['icon'] }> = [
  { keywords: ['seo', 'marketing', 'ads', 'campaña'], name: 'Marketing de crecimiento', icon: 'sparkles' },
  { keywords: ['web', 'sitio', 'landing', 'frontend'], name: 'Experiencias web', icon: 'code' },
  { keywords: ['api', 'integración', 'automation', 'automatización'], name: 'Integraciones y automatización', icon: 'layers' },
  { keywords: ['datos', 'analytics', 'bi'], name: 'Análisis e insights', icon: 'globe' },
];

function resolveCategory(name: string, description: string | null): { name: string; icon: ServiceGridItem['icon'] } {
  const source = `${name} ${description ?? ''}`.toLowerCase();
  for (const candidate of KEYWORD_CATEGORIES) {
    if (candidate.keywords.some(keyword => source.includes(keyword))) {
      return candidate;
    }
  }
  return { name: 'Servicios profesionales', icon: 'rocket' };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/20 bg-white/10 p-4">
      <p className="text-xs uppercase tracking-wide text-blue-100/80">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
