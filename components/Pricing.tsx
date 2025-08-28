import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const plans = [
  { name: 'Starter', price: 'Gratis', features: ['1 servicio'], cta: '/servicios' },
  { name: 'Business', price: 'USD 49', features: ['Todo Starter', 'Soporte prioritario'], cta: '/servicios' },
  { name: 'Pro', price: 'USD 99', features: ['Todo Business', 'Integraciones avanzadas'], cta: '/servicios' }
];

export function Pricing() {
  return (
    <section id="precios" className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]">
      <h2 className="mb-12 text-center text-3xl font-serif">Precios</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map(p => (
          <Card key={p.name} className="text-center">
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-bold">{p.price}</p>
              <ul className="space-y-1 text-sm">
                {p.features.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Button asChild className="mt-4">
                <a href={p.cta}>Comprar</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
