'use client';

import { Check, Clipboard } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  text: string;
}

export function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error('No fue posible copiar la dirección', error);
    }
  };

  return (
    <Button
      type="button"
      variant={copied ? 'default' : 'outline'}
      size="sm"
      onClick={copy}
      className="inline-flex items-center gap-2"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Clipboard className="h-4 w-4" aria-hidden />}
      <span>{copied ? 'Copiado' : 'Copiar dirección'}</span>
    </Button>
  );
}

