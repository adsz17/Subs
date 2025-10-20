"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Loader2 } from "lucide-react";

type QuickFilterOption = {
  label: string;
  columnId: string;
  value: unknown;
};

type BulkAction<TData> = {
  key: string;
  label: string;
  onAction: (rows: TData[]) => Promise<void> | void;
  variant?: ComponentProps<typeof Button>["variant"];
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableMultiSort?: boolean;
  quickFilters?: QuickFilterOption[];
  bulkActions?: BulkAction<TData>[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableMultiSort = false,
  quickFilters,
  bulkActions,
}: DataTableProps<TData, TValue>) {
  const [filter, setFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const enableSelection = (bulkActions?.length ?? 0) > 0;

  const selectionColumn: ColumnDef<TData, unknown> = useMemo(
    () => ({
      id: "__select__",
      header: ({ table }) => (
        <div className="px-2 py-1">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(event) =>
              table.toggleAllPageRowsSelected(event.target.checked)
            }
            aria-label="Seleccionar página"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-2 py-1">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={row.getIsSelected()}
            onChange={(event) => row.toggleSelected(event.target.checked)}
            aria-label="Seleccionar fila"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    []
  );

  const tableColumns = useMemo(
    () => (enableSelection ? [selectionColumn, ...columns] : columns),
    [columns, enableSelection, selectionColumn]
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      globalFilter: filter,
      sorting,
      columnFilters,
      pagination,
    },
    onGlobalFilterChange: setFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    enableMultiSort,
    enableRowSelection: enableSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows;

  const handleAction = async (action: BulkAction<TData>) => {
    if (!selectedRows.length) return;
    setActionLoading(action.key);
    try {
      await action.onAction(selectedRows.map((row) => row.original));
      table.resetRowSelection();
    } finally {
      setActionLoading(null);
    }
  };

  const renderSortIndicator = (headerId: string) => {
    const column = table.getColumn(headerId);
    if (!column) return null;
    const isSorted = column.getIsSorted();
    if (!isSorted) {
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-400" aria-hidden />;
    }
    return (
      <span className="ml-1 text-xs font-medium uppercase text-gray-500">
        {isSorted === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const handleQuickFilter = (option: QuickFilterOption) => {
    const column = table.getColumn(option.columnId);
    if (!column) return;
    const isActive = Object.is(column.getFilterValue(), option.value);
    column.setFilterValue(isActive ? undefined : option.value);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Input
            placeholder="Buscar en la tabla..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-xs"
          />
          {quickFilters && quickFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {quickFilters.map((option) => {
                const column = table.getColumn(option.columnId);
                const isActive = column
                  ? Object.is(column.getFilterValue(), option.value)
                  : false;
                return (
                  <Button
                    key={`${option.columnId}-${option.label}`}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    size="default"
                    onClick={() => handleQuickFilter(option)}
                  >
                    {option.label}
                  </Button>
                );
              })}
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  quickFilters.forEach((option) => {
                    const column = table.getColumn(option.columnId);
                    column?.setFilterValue(undefined);
                  });
                }}
              >
                Limpiar
              </Button>
            </div>
          )}
        </div>
        {enableSelection && selectedRows.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {selectedRows.length} seleccionados
            </span>
            {bulkActions?.map((action) => (
              <Button
                key={action.key}
                type="button"
                variant={action.variant ?? "outline"}
                onClick={() => handleAction(action)}
                disabled={!!actionLoading}
              >
                {actionLoading === action.key ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  action.label
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-2 py-1 text-left font-medium">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        className="flex items-center text-left text-sm font-medium"
                        onClick={header.column.getToggleSortingHandler()}
                        type="button"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {renderSortIndicator(header.column.id)}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-2 py-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          className="rounded border px-2 py-1 text-sm disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </button>
        <button
          className="rounded border px-2 py-1 text-sm disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
