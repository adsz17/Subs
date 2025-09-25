'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/lib/cart/store';

type Props = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number | null;
  currency: string | null;
};

function formatPrice(priceCents: number | null, currency: string | null) {
  if (priceCents === null) return 'Sin precio';
  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(priceCents / 100);
}

export function ServiceCard({ id, name, description, priceCents, currency }: Props) {
  const { addItem } = useCartStore();
  const formattedPrice = formatPrice(priceCents, currency);
  const isPurchasable = priceCents !== null;

  const handleAddToCart = () => {
    if (!isPurchasable) return;
    addItem({ id, name, price: priceCents / 100, qty: 1 });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        {description && (
          <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            {description.split('\n').map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
        <div className="mt-auto space-y-2">
          <p className="text-lg font-semibold">{formattedPrice}</p>
          <Button className="w-full" onClick={handleAddToCart} disabled={!isPurchasable}>
            {isPurchasable ? 'Agregar al carrito' : 'Consultar disponibilidad'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
