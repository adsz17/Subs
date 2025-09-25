'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart/store';

export type PricingService = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number | null;
  currency: string | null;
};

function formatPrice(priceCents: number | null, currency: string | null) {
  if (priceCents === null) return 'Sin precio';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
  }).format(priceCents / 100);
}

export function PricingGrid({ services }: { services: PricingService[] }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (service: PricingService) => {
    if (service.priceCents === null) return;
    addItem({ id: service.id, name: service.name, price: service.priceCents / 100, qty: 1 });
  };

  if (services.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">Aún no hay productos disponibles.</p>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {services.map((service) => {
        const formattedPrice = formatPrice(service.priceCents, service.currency);
        const isPurchasable = service.priceCents !== null;
        return (
          <Card key={service.id} className="text-center">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-bold">{formattedPrice}</p>
              {service.description && (
                <ul className="space-y-1 text-sm">
                  {service.description.split('\n').map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              <Button
                onClick={() => handleAdd(service)}
                className="mt-4"
                disabled={!isPurchasable}
              >
                {isPurchasable ? 'Agregar al carrito' : 'Consultar'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
