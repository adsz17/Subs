import Image from 'next/image';
import { prisma } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

export async function LogoCloud() {
  noStore();
  const logos = await prisma.logo.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <section className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]">
      <div className="flex flex-wrap items-center justify-center gap-6 opacity-70">
        {logos.map(l => (
          <Image key={l.id} src={l.imageUrl} alt="Logo" width={100} height={40} />
        ))}
        {logos.length === 0 && <p>No hay logos disponibles.</p>}
      </div>
    </section>
  );
}
