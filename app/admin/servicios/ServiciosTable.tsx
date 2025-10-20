"use client";

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Service, Price } from '@prisma/client';

export type ServiceWithPrices = Service & { prices: Price[] };

const columns: ColumnDef<ServiceWithPrices>[] = [
  { accessorKey: 'name', header: 'Nombre', enableSorting: true },
  {
    accessorKey: 'isActive',
    header: 'Estado',
    cell: ({ getValue }) => <StatusBadge active={getValue<boolean>()} />,
    filterFn: (row, columnId, filterValue) => {
      if (typeof filterValue !== 'boolean') return true;
      return row.getValue<boolean>(columnId) === filterValue;
    },
    enableSorting: true,
  },
  {
    id: 'prices',
    header: 'Precios',
    accessorFn: (row) => row.prices.length,
    cell: ({ getValue }) => getValue<number>(),
    enableSorting: true,
  },
  {
    accessorKey: 'updatedAt',
    header: 'Actualizado',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    sortingFn: 'datetime',
    enableSorting: true,
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
  const router = useRouter();

  const toPayload = (
    service: ServiceWithPrices,
    overrides?: Partial<Pick<Service, 'isActive'>>,
  ) => ({
    name: service.name,
    slug: service.slug,
    description: service.description ?? undefined,
    imageUrl: service.imageUrl ?? undefined,
    isActive: overrides?.isActive ?? service.isActive,
  });

  const bulkActivate = async (rows: ServiceWithPrices[], isActive: boolean) => {
    await Promise.all(
      rows.map((service) =>
        fetch(`/api/services/${service.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toPayload(service, { isActive })),
        })
      )
    );
    router.refresh();
  };

  const bulkDuplicate = async (rows: ServiceWithPrices[]) => {
    const timestamp = Date.now();
    await Promise.all(
      rows.map((service, index) =>
        fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${service.name} (copia)`,
            slug: `${service.slug}-${timestamp}-${index}`,
            description: service.description ?? undefined,
            imageUrl: service.imageUrl ?? undefined,
            isActive: service.isActive,
          }),
        })
      )
    );
    router.refresh();
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      enableMultiSort
      quickFilters={[
        { label: 'Activos', columnId: 'isActive', value: true },
        { label: 'Inactivos', columnId: 'isActive', value: false },
      ]}
      bulkActions={[
        {
          key: 'activate',
          label: 'Activar',
          onAction: (rows) => bulkActivate(rows, true),
        },
        {
          key: 'deactivate',
          label: 'Desactivar',
          onAction: (rows) => bulkActivate(rows, false),
        },
        {
          key: 'duplicate',
          label: 'Duplicar',
          onAction: bulkDuplicate,
          variant: 'default',
        },
      ]}
    />
  );
}

