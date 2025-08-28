import { prisma } from '@/lib/db';
import { ColumnDef } from '@tanstack/react-table';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { DataTable } from '@/components/admin/DataTable';
import { formatMoney } from '@/lib/format';

export const revalidate = 0;

export default async function PreciosPage() {
  const prices = await prisma.price.findMany({ include: { service: true } });
  type Price = typeof prices[number];

  const columns: ColumnDef<Price>[] = [
    {
      accessorKey: 'service.name',
      header: 'Servicio',
      cell: ({ row }) => row.original.service.name
    },
    {
      accessorKey: 'amountCents',
      header: 'Monto',
      cell: ({ row }) => formatMoney(row.original.amountCents, row.original.currency)
    },
    { accessorKey: 'currency', header: 'Moneda' },
    {
      accessorKey: 'isCurrent',
      header: 'Actual',
      cell: ({ getValue }) => (getValue<boolean>() ? 'Sí' : 'No')
    }
  ];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Precios' }]} />
      <DataTable columns={columns} data={prices} />
    </div>
  );
}
