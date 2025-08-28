"use client";

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/admin/DataTable';
import { formatMoney } from '@/lib/format';
import type { Price, Service } from '@prisma/client';

export type PriceWithService = Price & { service: Service };

const columns: ColumnDef<PriceWithService>[] = [
  {
    accessorKey: 'service.name',
    header: 'Servicio',
    cell: ({ row }) => row.original.service.name,
  },
  {
    accessorKey: 'amountCents',
    header: 'Monto',
    cell: ({ row }) => formatMoney(row.original.amountCents, row.original.currency),
  },
  { accessorKey: 'currency', header: 'Moneda' },
  {
    accessorKey: 'isCurrent',
    header: 'Actual',
    cell: ({ getValue }) => (getValue<boolean>() ? 'Sí' : 'No'),
  },
];

export function PreciosTable({ data }: { data: PriceWithService[] }) {
  return <DataTable columns={columns} data={data} />;
}

