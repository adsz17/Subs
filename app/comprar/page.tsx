import { prisma } from '@/lib/db';

export const revalidate = 0;

interface Props {
  searchParams: { plan?: string };
}

export default async function ComprarPage({ searchParams }: Props) {
  const payments = await prisma.paymentsConfig.findMany();
  const plan = searchParams.plan;
  return (
    <div className="container space-y-4">
      <h1 className="text-2xl font-bold">Carrito</h1>
      {plan && <p>Plan seleccionado: {plan}</p>}
      {payments.map((p) => (
        <div key={p.id} className="space-y-2">
          <p>Red: {p.network}</p>
          <p>Billetera: {p.wallet}</p>
          {p.qrUrl && (
            <img
              src={p.qrUrl}
              alt="Código QR"
              className="h-48 w-48 object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}
