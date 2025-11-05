'use client';

import { CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactModal } from '@/components/ContactModal';
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
    <Card className="flex h-full flex-col border border-blue-100 bg-gradient-to-br from-white to-blue-50/60">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Badge className="bg-blue-600/10 text-blue-700">{isPurchasable ? 'Disponible' : 'A medida'}</Badge>
            <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">{name}</CardTitle>
            <p className="text-sm text-slate-600">Diseñado para maximizar resultados sin fricciones operativas.</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600 shadow-inner">
            <Sparkles className="h-6 w-6" aria-hidden />
          </span>
        </div>
        <div className="flex items-end gap-3">
          <p className="text-3xl font-bold text-blue-600">{formattedPrice}</p>
          <span className="text-sm text-slate-500">Tarifa promocional</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-6">
        {description && (
          <ul className="space-y-2 text-sm text-slate-700">
            {description
              .split('\n')
              .map(line => line.trim())
              .filter(Boolean)
              .map(bullet => (
                <li key={bullet} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-500" aria-hidden />
                  <span>{bullet}</span>
                </li>
              ))}
          </ul>
        )}
        <div className="mt-auto grid gap-3 sm:grid-cols-2">
          <Button className="w-full" onClick={handleAddToCart} disabled={!isPurchasable}>
            {isPurchasable ? 'Agregar al carrito' : 'Solicitar cotización'}
          </Button>
          <ContactModal triggerText="Hablar con un especialista" />
        </div>
      </CardContent>
    </Card>
  );
}
