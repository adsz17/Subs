'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Package, ShoppingCart, Settings, X } from 'lucide-react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/servicios', label: 'Servicios', icon: Package },
  { href: '/admin/compras', label: 'Compras', icon: ShoppingCart },
  { href: '/admin/ajustes', label: 'Ajustes', icon: Settings },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 border-r bg-white p-4 shadow transition-transform dark:bg-gray-900 md:static md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="mb-6 flex items-center justify-between md:hidden">
        <span className="text-lg font-semibold">Menú</span>
        <button onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex flex-col space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800',
              pathname === href && 'bg-gray-100 dark:bg-gray-800',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
