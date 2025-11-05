'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PaymentsFormState {
  network: string;
  wallet: string;
  qrUrl: string;
  provider: 'manual' | 'coinbase';
}

export default function PagosAdmin() {
  const [form, setForm] = useState<PaymentsFormState>({ network: '', wallet: '', qrUrl: '', provider: 'manual' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/payments-config')
      .then((response) => response.json())
      .then((data) => setForm((prev) => ({ ...prev, ...data })));
  }, []);

  const submit = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/payments-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <section className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <div className="flex flex-col gap-2">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Pagos' }]} />
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Configuración general</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Actualiza la red principal y el proveedor por defecto utilizado al generar enlaces de pago.</p>
        </div>
      </section>

      <Card className="border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <CardHeader className="border-b border-white/10 pb-6 dark:border-slate-800/60">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Preferencias de cobro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Red por defecto</label>
            <Input
              value={form.network}
              onChange={(event) => setForm({ ...form, network: event.target.value })}
              placeholder="Ej. Ethereum"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Dirección de billetera</label>
            <Input
              value={form.wallet}
              onChange={(event) => setForm({ ...form, wallet: event.target.value })}
              placeholder="0x..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">URL del QR</label>
            <Input
              value={form.qrUrl}
              onChange={(event) => setForm({ ...form, qrUrl: event.target.value })}
              placeholder="https://"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Proveedor</label>
            <select
              value={form.provider}
              onChange={(event) => setForm({ ...form, provider: event.target.value as PaymentsFormState['provider'] })}
              className="h-11 w-full rounded-md border border-white/40 bg-white/70 px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring focus:ring-blue-200/60 dark:border-slate-800/60 dark:bg-slate-950/60 dark:text-slate-100"
            >
              <option value="manual">Manual</option>
              <option value="coinbase">Coinbase</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button onClick={submit} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar preferencias'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

