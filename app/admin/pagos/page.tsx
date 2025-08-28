'use client';

import { useEffect, useState } from 'react';

export default function PagosAdmin() {
  const [form, setForm] = useState({ network: '', wallet: '', qrUrl: '', provider: 'manual' });

  useEffect(() => {
    fetch('/api/admin/payments-config').then((r) => r.json()).then(setForm);
  }, []);

  const submit = async () => {
    await fetch('/api/admin/payments-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-2">
      <input
        value={form.network}
        onChange={(e) => setForm({ ...form, network: e.target.value })}
        placeholder="Red"
        className="w-full p-2 border rounded"
      />
      <input
        value={form.wallet}
        onChange={(e) => setForm({ ...form, wallet: e.target.value })}
        placeholder="Wallet"
        className="w-full p-2 border rounded"
      />
      <input
        value={form.qrUrl}
        onChange={(e) => setForm({ ...form, qrUrl: e.target.value })}
        placeholder="QR URL"
        className="w-full p-2 border rounded"
      />
      <select
        value={form.provider}
        onChange={(e) => setForm({ ...form, provider: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="manual">Manual</option>
        <option value="coinbase">Coinbase</option>
      </select>
      <button
        onClick={submit}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Guardar
      </button>
    </div>
  );
}

