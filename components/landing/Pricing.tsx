import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const plans = [
  { name: 'Starter', price: 'Gratis', features: ['1 servicio'], cta: '/servicios' },
  { name: 'Business', price: 'USD 49', features: ['Todo Starter', 'Soporte prioritario'], cta: '/servicios' },
  { name: 'Pro', price: 'USD 99', features: ['Todo Business', 'Integraciones avanzadas'], cta: '/servicios' }
];

export function Pricing() {
  return (
    <section id="precios" className="container py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Precios</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map(p => (
          <Card key={p.name} className="bg-white/5 text-center">
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-bold">{p.price}</p>
              <ul className="text-sm space-y-1">
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
