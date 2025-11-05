import Link from "next/link";

interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="text-slate-400 transition hover:text-blue-500">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-500">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="text-slate-500/60">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
