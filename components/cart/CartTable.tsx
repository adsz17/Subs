'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/lib/cart/store';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function CartTable() {
  const { items, increment, decrement, removeItem } = useCartStore();

  const hasItems = items.length > 0;
  const totalQuantity = useMemo(() => items.reduce((acc, item) => acc + item.qty, 0), [items]);

  if (!hasItems) {
    return (
      <Alert className="border-dashed">
        <AlertTitle>Tu carrito está vacío</AlertTitle>
        <AlertDescription>
          Agrega servicios para visualizar el resumen y avanzar hacia el checkout. Puedes explorar el catálogo desde la sección de
          servicios.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <p>Gestiona cada servicio y ajusta la cantidad antes de continuar con el pago.</p>
        <Badge className="bg-blue-100 text-blue-700">{totalQuantity} ítem(s)</Badge>
      </div>
      <div className="space-y-3">
        {items.map(item => {
          const subtotal = item.price * item.qty;
          const canDecrease = item.qty > 1;

          return (
            <Card key={item.id} className="border border-slate-200/80">
              <CardHeader className="mb-0 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-900">{item.name}</CardTitle>
                  <p className="text-sm text-slate-500">Pago único - incluye soporte inicial y acompañamiento.</p>
                </div>
                <Badge className="bg-blue-50 text-blue-700">{formatCurrency(item.price)}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => decrement(item.id)}
                    disabled={!canDecrease}
                    aria-label={`Disminuir cantidad de ${item.name}`}
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                  </Button>
                  <span className="min-w-[2rem] text-center text-sm font-medium text-slate-700" aria-live="polite">
                    {item.qty}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => increment(item.id)}
                    aria-label={`Incrementar cantidad de ${item.name}`}
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-6 sm:ml-auto sm:gap-8">
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Subtotal</p>
                    <p className="text-lg font-semibold text-slate-900">{formatCurrency(subtotal)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Eliminar ${item.name} del carrito`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

