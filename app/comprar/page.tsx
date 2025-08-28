import { prisma } from '@/lib/db';

export const revalidate = 0;

interface Props {
  searchParams: { plan?: string };
}

export default async function ComprarPage({ searchParams }: Props) {
  const settings = await prisma.setting.findUnique({ where: { id: 1 } });
  const plan = searchParams.plan;
  return (
    <div className="container space-y-4">
      <h1 className="text-2xl font-bold">Carrito</h1>
      {plan && <p>Plan seleccionado: {plan}</p>}
      {settings?.cryptoNetwork && <p>Red: {settings.cryptoNetwork}</p>}
      {settings?.walletAddress && <p>Billetera: {settings.walletAddress}</p>}
      {settings?.qrCodeUrl && (
        <img
          src={settings.qrCodeUrl}
          alt="Código QR"
          className="h-48 w-48 object-cover"
        />
      )}
    </div>
  );
}
