'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart/store';

const plans = [
  { name: 'Starter', price: 'Gratis', features: ['1 servicio'] },
  {
    name: 'Business',
    price: 'USD 49',
    features: ['Todo Starter', 'Soporte prioritario'],
  },
  {
    name: 'Pro',
    price: 'USD 99',
    features: ['Todo Business', 'Integraciones avanzadas'],
  },
];

export function Pricing() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (p: { name: string; price: string }) => {
    const price = p.price.includes('USD')
      ? parseFloat(p.price.replace('USD', '').trim())
      : 0;
    addItem({ id: p.name, name: p.name, price, qty: 1 });
    router.push('/carrito');
  };

  return (
    <section id="precios" className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]">
      <h2 className="mb-12 text-center text-3xl font-serif">Precios</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.name} className="text-center">
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-bold">{p.price}</p>
              <ul className="space-y-1 text-sm">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Button onClick={() => handleAdd(p)} className="mt-4">
                Agregar al carrito
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

