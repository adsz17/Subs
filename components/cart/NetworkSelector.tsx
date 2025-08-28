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
    fetch('/api/admin/payments-config')
      .then((r) => r.json())
      .then((data) => setConfig(data));
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

