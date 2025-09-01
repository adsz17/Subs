'use client';

import { useEffect, useState } from 'react';

const NETWORKS = ['TRON-TRC20', 'ETH-ERC20', 'BSC-BEP20', 'Polygon-ERC20'];

interface Config {
  network: string;
  wallet: string;
  qrUrl?: string | null;
  provider: string;
}

export function NetworkSelector({
  value,
  onChange
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const r = await fetch('/api/admin/payments-config');
        if (!r.ok) {
          console.error('Failed to fetch payments config', await r.text());
          return;
        }
        const data = await r.json();
        setConfig(data);
      } catch (err) {
        console.error('Failed to fetch payments config', err);
      }
    };
    loadConfig();
  }, []);

  const options = config?.provider === 'manual' ? NETWORKS : [config?.network || ''];

  return (
    <select
      className="border p-2 rounded"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={config?.provider !== 'manual'}
    >
      {options.map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );
}

