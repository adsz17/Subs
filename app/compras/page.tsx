import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

export default async function ComprasPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?next=/compras');
  }
  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { service: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Mis compras</h1>
      {purchases.length === 0 ? (
        <p>No has realizado compras todavía.</p>
      ) : (
        <ul className="space-y-4">
          {purchases.map((p) => (
            <li key={p.id} className="rounded border p-4">
              <p className="mb-2 text-sm text-muted-foreground">
                {p.createdAt.toLocaleDateString()}
              </p>
              <ul className="list-disc space-y-1 pl-5">
                {p.items.map((it) => (
                  <li key={it.id}>
                    <Link href={`/servicios/${it.serviceId}`}>{it.service.name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
