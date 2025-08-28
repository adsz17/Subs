'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import type { Purchase, PurchaseStatus } from '@prisma/client';

const ActionButtons = ({ id }: { id: string }) => {
  const update = async (status: PurchaseStatus) => {
    await fetch(`/api/purchases/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    location.reload();
  };
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => update('APPROVED')}>
        Aprobar
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-red-600 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-600 dark:hover:bg-red-950"
        onClick={() => update('REJECTED')}
      >
        Rechazar
      </Button>
    </div>
  );
};

const columns: ColumnDef<Purchase>[] = [
  { accessorKey: 'txHash', header: 'TxHash' },
  { accessorKey: 'network', header: 'Red' },
  { accessorKey: 'status', header: 'Estado' },
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => <ActionButtons id={row.original.id} />,
  },
];

export function ComprasTable({ data }: { data: Purchase[] }) {
  return <DataTable columns={columns} data={data} />;
}
