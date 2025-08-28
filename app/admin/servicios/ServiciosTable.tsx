"use client";

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import Link from 'next/link';
import type { Service, Price } from '@prisma/client';

export type ServiceWithPrices = Service & { prices: Price[] };

const columns: ColumnDef<ServiceWithPrices>[] = [
  { accessorKey: 'name', header: 'Nombre' },
  {
    accessorKey: 'isActive',
    header: 'Estado',
    cell: ({ getValue }) => <StatusBadge active={getValue<boolean>()} />,
  },
  {
    id: 'prices',
    header: 'Precios',
    cell: ({ row }) => row.original.prices.length,
  },
  {
    accessorKey: 'updatedAt',
    header: 'Actualizado',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => (
      <Link className="text-blue-600 underline" href={`/admin/servicios/${row.original.id}`}>
        Editar
      </Link>
    ),
  },
];

export function ServiciosTable({ data }: { data: ServiceWithPrices[] }) {
  return <DataTable columns={columns} data={data} />;
}

