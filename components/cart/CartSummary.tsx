'use client';

import { ShieldCheck, Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/lib/cart/store';
import { useRouter } from 'next/navigation';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function CartSummary() {
  const { items, total } = useCartStore();
  const router = useRouter();

  const subtotal = total();
  const processingFee = useMemo(() => (subtotal > 0 ? Math.max(5, subtotal * 0.015) : 0), [subtotal]);
  const totalWithFees = subtotal + processingFee;
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <Alert className="border-dashed">
        <AlertTitle>Sin servicios seleccionados</AlertTitle>
        <AlertDescription>
          Agrega un servicio al carrito para habilitar las acciones de pago. Puedes combinar múltiples planes y consolidarlos en
          una sola orden.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="max-w-md border border-blue-100">
      <CardHeader className="space-y-3">
        <Badge className="bg-blue-50 text-blue-700">Resumen financiero</Badge>
        <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
          <Wallet className="h-6 w-6 text-blue-600" aria-hidden />
          Total estimado
        </CardTitle>
        <p className="text-sm text-slate-600">
          Incluye un fee operativo estimado para cubrir costos de procesamiento y conciliación en redes blockchain.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Subtotal ({items.length} servicio(s))</span>
          <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Fee operativo (1.5% mínimo USD 5)</span>
          <span className="font-medium text-slate-900">{formatCurrency(processingFee)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4 text-lg font-semibold text-slate-900">
          <span>Total a pagar</span>
          <span>{formatCurrency(totalWithFees)}</span>
        </div>
        <Alert variant="default" className="border-blue-100 bg-blue-50/80 text-blue-800">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          <AlertDescription className="pl-7">
            El monto final puede ajustarse tras validar la red seleccionada y la cotización vigente de la stablecoin elegida.
          </AlertDescription>
        </Alert>
        <Button className="w-full" onClick={() => router.push('/checkout')}>
          Continuar a checkout seguro
        </Button>
      </CardContent>
    </Card>
  );
}

