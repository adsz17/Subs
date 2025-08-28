import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="mb-4">Tu carrito está vacío.</p>
      <Link href="/servicios" className="text-blue-600">
        Ver servicios
      </Link>
    </div>
  );
}

