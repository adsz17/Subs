import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';

export const revalidate = 0;

export default async function LogosPage() {
  const logos = await prisma.logo.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Logos' }]} />
      <div className="mt-4">
        <Link href="/admin/logos/nuevo" className="btn mb-4 inline-block">
          Nuevo
        </Link>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {logos.map((l) => (
            <Link key={l.id} href={`/admin/logos/${l.id}`} className="block">
              <Image src={l.imageUrl} alt="Logo" width={100} height={40} />
            </Link>
          ))}
          {logos.length === 0 && <p>No hay logos.</p>}
        </div>
      </div>
    </div>
  );
}
