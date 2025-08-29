'use client';

import Image from 'next/image';
import { CopyButton } from './CopyButton';

interface Props {
  address: string;
  qrUrl?: string | null;
  network: string;
}

export function WalletBox({ address, qrUrl, network }: Props) {
  const link = (() => {
    if (network.startsWith('TRON')) return `https://tronscan.org/#/address/${address}`;
    if (network.startsWith('ETH')) return `https://etherscan.io/address/${address}`;
    if (network.startsWith('BSC')) return `https://bscscan.com/address/${address}`;
    return `https://polygonscan.com/address/${address}`;
  })();

  return (
    <div className="p-4 border rounded mt-4">
      <p className="mb-2 break-all">{address}</p>
      <CopyButton text={address} />
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 text-sm text-blue-600"
      >
        Abrir wallet
      </a>
      {qrUrl && (
        <div className="mt-4">
          <Image src={qrUrl} alt="QR" width={150} height={150} unoptimized />
        </div>
      )}
    </div>
  );
}

