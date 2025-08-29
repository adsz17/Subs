import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';

export const revalidate = 0;

export default async function MensajesPage() {
  const mensajes = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Mensajes' }]} />
      <div className="mt-4 space-y-4">
        {mensajes.length === 0 && <p>No hay mensajes.</p>}
        {mensajes.map((m) => (
          <div key={m.id} className="rounded border bg-white p-4 shadow-sm">
            <p className="font-semibold">
              {m.name} ({m.email})
            </p>
            <p className="mt-2 whitespace-pre-wrap">{m.message}</p>
            <p className="mt-2 text-sm text-gray-500">
              {m.createdAt.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

