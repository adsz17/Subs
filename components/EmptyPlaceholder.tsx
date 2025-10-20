import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface EmptyPlaceholderProps {
  title: string;
  description: string;
  href: string;
  actionLabel?: string;
}

export function EmptyPlaceholder({
  title,
  description,
  href,
  actionLabel = 'Ir al panel',
}: EmptyPlaceholderProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-200 bg-white/70 p-10 text-center shadow-soft">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Sparkles className="h-8 w-8 animate-pulse" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-600">{description}</p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
