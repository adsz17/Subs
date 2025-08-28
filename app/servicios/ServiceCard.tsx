'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/lib/cart/store';

type Props = {
  id: string;
  name: string;
  description: string | null;
  price: string;
};

export function ServiceCard({ id, name, description, price }: Props) {
  const { addItem } = useCartStore();
  const priceNumber = parseFloat(price.replace('$', ''));
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        {description && (
          <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            {description.split('\n').map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
        <div className="mt-auto space-y-2">
          <p className="text-lg font-semibold">{price}</p>
          <Button className="w-full" onClick={() => addItem({ id, name, price: priceNumber, qty: 1 })}>
            Agregar al carrito
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
