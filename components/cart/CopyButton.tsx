'use client';

import { useState } from 'react';

interface Props {
  text: string;
}

export function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="px-3 py-1 text-sm border rounded"
    >
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

