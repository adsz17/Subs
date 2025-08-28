import { prisma } from '@/lib/db';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';

export const revalidate = 0;

export default async function ServiciosPage() {
  const services = await prisma.service.findMany({
    include: { prices: true },
    orderBy: { updatedAt: 'desc' }
  });

  type Service = typeof services[number];

  const columns: ColumnDef<Service>[] = [
    { accessorKey: 'name', header: 'Nombre' },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ getValue }) => <StatusBadge active={getValue<boolean>()} />
    },
    {
      id: 'prices',
      header: 'Precios',
      cell: ({ row }) => row.original.prices.length
    },
    {
      accessorKey: 'updatedAt',
      header: 'Actualizado',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString()
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <Link className="text-blue-600 underline" href={`/admin/servicios/${row.original.id}`}>
          Editar
        </Link>
      )
    }
  ];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Servicios' }]} />
      <DataTable columns={columns} data={services} />
    </div>
  );
}
