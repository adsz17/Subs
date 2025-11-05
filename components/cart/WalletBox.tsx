'use client';
/* eslint-disable @next/next/no-img-element */

import { ExternalLink, QrCode } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from './CopyButton';

interface Props {
  address: string;
  qrUrl?: string | null;
  network: string;
}

export function WalletBox({ address, qrUrl, network }: Props) {
  const explorerLink = getExplorerUrl(network, address);

  return (
    <Card className="border border-blue-100">
      <CardHeader className="space-y-3">
        <Badge className="bg-blue-50 text-blue-700">Wallet corporativa</Badge>
        <CardTitle className="text-xl text-slate-900">Dirección para {network}</CardTitle>
        <p className="text-sm text-slate-600">
          Envía únicamente stablecoins compatibles con la red seleccionada. Una vez confirmada la transacción, carga el hash
          para acelerar la verificación manual.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border border-dashed border-blue-200 bg-blue-50/40 p-4">
          <p className="text-xs uppercase tracking-wide text-blue-500">Wallet</p>
          <p className="break-all text-base font-mono text-slate-900">{address}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <CopyButton text={address} />
            <a
              href={explorerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Ver en explorador
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>

        {qrUrl && (
          <div className="flex flex-col items-start gap-2 rounded-md border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <QrCode className="h-4 w-4 text-blue-600" aria-hidden />
              Escanea desde tu wallet
            </div>
            <img src={qrUrl} alt="Código QR para el pago" className="h-44 w-44 rounded-md border object-cover" />
          </div>
        )}

        <Alert className="border-blue-100 bg-blue-50 text-blue-800">
          <AlertDescription>
            No compartas esta dirección fuera de los canales oficiales. Tras confirmar el pago recibirás una notificación por
            correo con los siguientes pasos.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function getExplorerUrl(network: string, address: string) {
  if (network.startsWith('TRON')) return `https://tronscan.org/#/address/${address}`;
  if (network.startsWith('ETH')) return `https://etherscan.io/address/${address}`;
  if (network.startsWith('BSC')) return `https://bscscan.com/address/${address}`;
  return `https://polygonscan.com/address/${address}`;
}

