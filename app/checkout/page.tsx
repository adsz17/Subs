'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CartTable } from '@/components/cart/CartTable';
import { CartSummary } from '@/components/cart/CartSummary';
import { PaymentSteps } from '@/components/cart/PaymentSteps';
import { NetworkSelector } from '@/components/cart/NetworkSelector';
import { WalletBox } from '@/components/cart/WalletBox';
import { useCartStore } from '@/lib/cart/store';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const { items, clear } = useCartStore();
  const [network, setNetwork] = useState('TRON-TRC20');
  const [config, setConfig] = useState<any>(null);
  const [tx, setTx] = useState('');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    fetch('/api/admin/payments-config')
      .then((r) => r.json())
      .then(setConfig);
  }, []);

  const start = async () => {
    const res = await fetch('/api/checkout/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    const data = await res.json();
    window.history.replaceState(null, '', `/checkout?orderId=${data.id}`);
    setStep(1);
  };

  const confirm = async () => {
    if (!orderId) return;
    await fetch(`/api/orders/${orderId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash: tx })
    });
    clear();
    setStep(2);
  };

  return (
    <div className="container mx-auto p-4">
      <PaymentSteps step={step} />
      {step === 0 && (
        <div>
          <CartTable />
          <div className="flex justify-end">
            <CartSummary />
          </div>
          <button
            onClick={start}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            disabled={items.length === 0}
          >
            Iniciar pago
          </button>
        </div>
      )}
      {step === 1 && config && (
        <div>
          <NetworkSelector value={network} onChange={setNetwork} />
          <WalletBox address={config.wallet} qrUrl={config.qrUrl} network={network} />
          <div className="mt-4">
            <input
              value={tx}
              onChange={(e) => setTx(e.target.value)}
              placeholder="Hash de transacción"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={confirm}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Enviar comprobante
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <p>Tu pago está en revisión. Gracias.</p>
      )}
    </div>
  );
}

