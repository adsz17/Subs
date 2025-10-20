import type { ReactNode } from 'react';

import { unstable_noStore as noStore } from 'next/cache';
import Image from 'next/image';

type HighlightBadgeProps = {
  children: ReactNode;
};

export function HighlightBadge({ children }: HighlightBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur">
      {children}
    </div>
  );
}

export async function LogoCloud() {
  noStore();
  const { prisma } = await import('@/lib/db');
  const logos = await prisma.logo.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <section className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]">
      <div className="flex flex-wrap items-center justify-center gap-6 opacity-70">
        {logos.map((l) => (
          <HighlightBadge key={l.id}>
            <Image
              src={l.imageUrl}
              alt="Logo"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </HighlightBadge>
        ))}
        {logos.length === 0 && <p>No hay logos disponibles.</p>}
      </div>
    </section>
  );
}
