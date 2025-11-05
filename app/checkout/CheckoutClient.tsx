'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CartTable } from '@/components/cart/CartTable';
import { CartSummary } from '@/components/cart/CartSummary';
import { PaymentSteps } from '@/components/cart/PaymentSteps';
import { NetworkSelector } from '@/components/cart/NetworkSelector';
import { WalletBox } from '@/components/cart/WalletBox';
import { useCartStore } from '@/lib/cart/store';

interface PaymentsConfig {
  network: string;
  wallet: string;
  qrUrl?: string | null;
  provider: string;
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const { items, clear } = useCartStore();
  const [network, setNetwork] = useState('TRON-TRC20');
  const [config, setConfig] = useState<PaymentsConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [tx, setTx] = useState('');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const r = await fetch('/api/admin/payments-config');
        if (!r.ok) {
          const message = await r.text();
          console.error('Failed to fetch payments config', message);
          setConfigError('No pudimos cargar la configuración de pagos. Intenta actualizar la página.');
          return;
        }
        const data: PaymentsConfig = await r.json();
        setConfig(data);
        if (data.network) {
          setNetwork(data.network);
        }
      } catch (err) {
        console.error('Failed to fetch payments config', err);
        setConfigError('Ocurrió un error inesperado al obtener la wallet corporativa.');
      }
    };
    loadConfig();
  }, []);

  const isCartEmpty = items.length === 0;
  const disableStart = isCartEmpty || loadingOrder;

  const start = async () => {
    setLoadingOrder(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/checkout/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const message = await res.text();
        console.error('Failed to start checkout', message);
        setStatusMessage({ type: 'error', message: 'No pudimos crear la orden. Intenta nuevamente o contacta a soporte.' });
        return;
      }
      const data = await res.json();
      window.history.replaceState(null, '', `/checkout?orderId=${data.id}`);
      setStatusMessage({ type: 'success', message: 'Orden generada correctamente. Revisa los datos de pago y envía tu comprobante.' });
      setStep(1);
    } finally {
      setLoadingOrder(false);
    }
  };

  const confirm = async () => {
    setStatusMessage(null);
    if (!orderId) {
      setStatusMessage({ type: 'error', message: 'Genera una orden antes de enviar el comprobante.' });
      return;
    }
    if (tx.trim().length < 10) {
      setStatusMessage({ type: 'error', message: 'Ingresa un hash válido de transacción para continuar.' });
      return;
    }
    const res = await fetch(`/api/orders/${orderId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash: tx.trim(), network }),
    });
    if (!res.ok) {
      const message = await res.text();
      console.error('Failed to confirm order', message);
      setStatusMessage({ type: 'error', message: 'No pudimos registrar tu comprobante. Intenta nuevamente.' });
      return;
    }
    clear();
    setStatusMessage({ type: 'success', message: 'Recibimos tu comprobante. Estamos validando la transacción.' });
    setStep(2);
  };

  const confirmationNotes = useMemo(
    () => [
      'Validaremos el hash contra el explorador correspondiente para confirmar la transferencia.',
      'Una vez aprobado, enviaremos un correo con los accesos y el cronograma de onboarding.',
      'Si la transacción caduca o se envía un monto distinto, nuestro equipo te contactará para regularizar.',
    ],
    []
  );

  return (
    <div className="space-y-8 bg-slate-50 pb-16">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 text-white">
        <div className="container space-y-6 py-12">
          <Badge className="bg-white/20 text-white">Checkout corporativo</Badge>
          <h1 className="text-4xl font-semibold tracking-tight">Completa tu pago manual</h1>
          <p className="max-w-2xl text-blue-100">
            Sigue los pasos para generar tu orden, transferir a la wallet corporativa y cargar el comprobante de pago. Nuestro
            equipo monitorea cada paso en tiempo real.
          </p>
          <PaymentSteps step={step} />
        </div>
      </section>

      <div className="container space-y-6">
        {statusMessage && (
          <Alert variant={statusMessage.type === 'error' ? 'destructive' : 'success'}>
            <AlertTitle>{statusMessage.type === 'error' ? 'Algo salió mal' : 'Todo listo'}</AlertTitle>
            <AlertDescription>{statusMessage.message}</AlertDescription>
          </Alert>
        )}

        {step === 0 && (
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <Card className="border border-blue-100">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl text-slate-900">Resumen de servicios</CardTitle>
                <p className="text-sm text-slate-600">Verifica los servicios incluidos y ajusta la cantidad antes de generar tu orden manual.</p>
              </CardHeader>
              <CardContent>
                <CartTable />
              </CardContent>
            </Card>
            <aside className="space-y-4">
              <CartSummary />
              <Button className="w-full" onClick={start} disabled={disableStart}>
                {loadingOrder ? 'Generando orden…' : 'Generar orden manual'}
              </Button>
            </aside>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <NetworkSelector value={network} onChange={setNetwork} />
              {configError ? (
                <Alert variant="destructive">
                  <AlertTitle>No se cargó la wallet</AlertTitle>
                  <AlertDescription>{configError}</AlertDescription>
                </Alert>
              ) : (
                config && <WalletBox address={config.wallet} qrUrl={config.qrUrl} network={network} />
              )}
            </div>
            <aside className="space-y-4">
              <Card className="border border-blue-100">
                <CardHeader className="space-y-2">
                  <Badge className="bg-blue-50 text-blue-700">Hash de transacción</Badge>
                  <CardTitle className="text-xl text-slate-900">Comparte tu comprobante</CardTitle>
                  <p className="text-sm text-slate-600">
                    Pega el identificador de la transacción una vez que la red confirme el envío. No cierres esta pantalla hasta ver la confirmación.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input value={tx} onChange={event => setTx(event.target.value)} placeholder="0x..." />
                  <Button className="w-full" onClick={confirm}>
                    Enviar comprobante
                  </Button>
                </CardContent>
              </Card>
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">¿Qué sucede después?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {confirmationNotes.map(note => (
                      <li key={note} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}

        {step === 2 && (
          <Card className="border border-blue-100 bg-white">
            <CardHeader className="space-y-2">
              <Badge className="bg-blue-50 text-blue-700">Pago recibido</Badge>
              <CardTitle className="text-2xl text-slate-900">Estamos validando tu transferencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>Recibirás una notificación por correo en cuanto confirmemos el pago en la red {network}.</p>
              <p>
                Mientras tanto puedes regresar al catálogo para seguir explorando servicios o revisar el estado de tus órdenes en la sección de compras.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

