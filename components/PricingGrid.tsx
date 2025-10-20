'use client';

import * as React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/cart/store';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';

export type BillingPeriod = 'monthly' | 'annual';

export type PricingService = {
  id: string;
  name: string;
  description: string | null;
  recommended: boolean;
  prices: Array<{
    id: string;
    amountCents: number;
    currency: string;
    period: BillingPeriod | null;
  }>;
};

function getPriceForPeriod(service: PricingService, period: BillingPeriod) {
  return service.prices.find((price) => price.period === period) ?? service.prices[0] ?? null;
}

const billingLabels: Record<BillingPeriod, string> = {
  monthly: 'Mensual',
  annual: 'Anual',
};

export function PricingGrid({ services }: { services: PricingService[] }) {
  const addItem = useCartStore((state) => state.addItem);
  const availablePeriods = React.useMemo(() => {
    const periods = new Set<BillingPeriod>();
    for (const service of services) {
      for (const price of service.prices) {
        if (price.period === 'monthly' || price.period === 'annual') {
          periods.add(price.period);
        }
      }
    }
    return (['monthly', 'annual'] as const).filter((period) => periods.has(period));
  }, [services]);

  const defaultPeriod = React.useMemo(
    () => availablePeriods[0] ?? 'monthly',
    [availablePeriods]
  );

  const [billingPeriod, setBillingPeriod] = React.useState<BillingPeriod>(defaultPeriod);
  const [detailService, setDetailService] = React.useState<PricingService | null>(null);

  React.useEffect(() => {
    if (availablePeriods.length === 0) return;
    if (!availablePeriods.includes(billingPeriod)) {
      setBillingPeriod(availablePeriods[0]);
    }
  }, [availablePeriods, billingPeriod]);

  React.useEffect(() => {
    setBillingPeriod(defaultPeriod);
  }, [defaultPeriod]);

  const handleAdd = (service: PricingService) => {
    const selectedPrice = getPriceForPeriod(service, billingPeriod);
    if (!selectedPrice) return;
    addItem({ id: service.id, name: service.name, price: selectedPrice.amountCents / 100, qty: 1 });
  };

  if (services.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">Aún no hay productos disponibles.</p>;
  }

  const showToggle = availablePeriods.length > 1;

  return (
    <>
      {showToggle && (
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-full border border-blue-100 bg-blue-50 p-1">
            {availablePeriods.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setBillingPeriod(period)}
                className={cn(
                  'rounded-full px-4 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                  billingPeriod === period
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-blue-600 hover:bg-white'
                )}
              >
                {billingLabels[period]}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-8 md:grid-cols-3">
        {services.map((service) => {
          const selectedPrice = getPriceForPeriod(service, billingPeriod);
          const formattedPrice = selectedPrice
            ? formatMoney(selectedPrice.amountCents, selectedPrice.currency)
            : 'Sin precio';
          const isPurchasable = Boolean(selectedPrice);
          return (
            <Card
              key={service.id}
              className={cn(
                'relative text-center',
                service.recommended && 'border-2 border-blue-500 shadow-lg'
              )}
            >
              <CardHeader className="space-y-2">
                {service.recommended && (
                  <Badge className="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2">
                    Recomendado
                  </Badge>
                )}
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-4xl font-bold">{formattedPrice}</p>
                  {selectedPrice?.period && (
                    <p className="text-xs uppercase text-muted-foreground">
                      {selectedPrice.period === 'monthly' ? 'por mes' : 'por año'}
                    </p>
                  )}
                </div>
                {service.description && (
                  <ul className="space-y-1 text-sm">
                    {service.description.split('\n').map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-col gap-3">
                  <Button onClick={() => handleAdd(service)} disabled={!isPurchasable}>
                    {isPurchasable ? 'Agregar al carrito' : 'Consultar'}
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/comprar/${service.id}`}>Comprar ahora</Link>
                  </Button>
                  <Button variant="ghost" onClick={() => setDetailService(service)}>
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {detailService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{detailService.name}</h3>
                {detailService.recommended && (
                  <Badge className="mt-2 bg-blue-600 text-white">Recomendado</Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-900"
                onClick={() => setDetailService(null)}
                aria-label="Cerrar detalles"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {detailService.description ? (
              <p className="whitespace-pre-line text-sm text-gray-600">{detailService.description}</p>
            ) : (
              <p className="text-sm text-gray-500">Este servicio no tiene descripción adicional disponible.</p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setDetailService(null)}>
                Cerrar
              </Button>
              <Button asChild>
                <Link href={`/comprar/${detailService.id}`}>Ir a comprar</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
