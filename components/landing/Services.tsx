import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Globe, Layers } from 'lucide-react';

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
    <section id="servicios" className="container py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Servicios</h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {servicios.map((s, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Card key={s.id} className="bg-white/5">
              <CardHeader className="flex items-center gap-2">
                <Icon className="h-6 w-6 text-blue-500" aria-hidden />
                <CardTitle>{s.name}</CardTitle>
              </CardHeader>
              <CardContent>{s.description}</CardContent>
            </Card>
          );
        })}
        {servicios.length === 0 && <p>No hay servicios disponibles.</p>}
      </div>
    </section>
  );
}
