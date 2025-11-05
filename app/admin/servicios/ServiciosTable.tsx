"use client";

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buildDuplicatePayload, toPayload, type ServiceWithPrices } from './payloads';

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
          body: JSON.stringify(
            buildDuplicatePayload(service, `${timestamp}-${index}`),
          ),
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
      title="Servicios"
      subtitle="Gestiona la oferta activa, duplica servicios y actualiza su visibilidad rápidamente."
      emptyTitle="No se encontraron servicios"
      emptyDescription="Cambia los filtros aplicados o crea un nuevo servicio para que aparezca aquí."
    />
  );
}

export type { ServiceWithPrices } from './payloads';

