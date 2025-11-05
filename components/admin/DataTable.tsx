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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpDown, FilterX, Inbox, Loader2 } from "lucide-react";

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
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbarAction?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableMultiSort = false,
  quickFilters,
  bulkActions,
  title,
  subtitle,
  emptyTitle = "Sin resultados",
  emptyDescription = "Ajusta los filtros o crea un nuevo registro para comenzar.",
  toolbarAction,
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
    <Card className="border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/60">
      {(title || subtitle || toolbarAction) && (
        <CardHeader className="space-y-2 border-b border-white/10 pb-5 dark:border-slate-800/60">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {title && <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">{title}</CardTitle>}
              {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
            </div>
            {toolbarAction && <div className="flex items-center gap-2">{toolbarAction}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Input
                placeholder="Buscar en la tabla..."
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="h-10 rounded-full border-white/40 bg-white/70 pl-4 pr-10 text-sm shadow-sm focus:border-blue-400 focus:ring-blue-200/60 dark:border-slate-800/70 dark:bg-slate-900/70"
                title="Usa este campo para buscar en todas las columnas visibles"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                ⇧⌘F
              </span>
            </div>
            {quickFilters && quickFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {quickFilters.map((option) => {
                  const column = table.getColumn(option.columnId);
                  const isActive = column ? Object.is(column.getFilterValue(), option.value) : false;
                  return (
                    <button
                      key={`${option.columnId}-${option.label}`}
                      type="button"
                      onClick={() => handleQuickFilter(option)}
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition",
                        isActive
                          ? "border-blue-500/60 bg-blue-500/10 text-blue-600 shadow-sm dark:border-blue-400/50 dark:bg-blue-400/20 dark:text-blue-200"
                          : "border-white/40 bg-white/60 text-slate-600 hover:border-blue-300 hover:bg-blue-50/80 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800/60"
                      )}
                      aria-pressed={isActive}
                      title={`Filtrar por ${option.label}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current opacity-60" />
                      {option.label}
                    </button>
                  );
                })}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                  onClick={() => {
                    quickFilters.forEach((option) => {
                      const column = table.getColumn(option.columnId);
                      column?.setFilterValue(undefined);
                    });
                  }}
                >
                  <FilterX className="h-3.5 w-3.5" />
                  Limpiar
                </Button>
              </div>
            )}
          </div>
          {enableSelection && selectedRows.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-700 shadow-sm dark:border-blue-400/40 dark:bg-blue-400/10 dark:text-blue-200">
              <Badge className="bg-blue-600/90 text-xs">{selectedRows.length}</Badge>
              seleccionados
              {bulkActions?.map((action) => (
                <Button
                  key={action.key}
                  type="button"
                  variant={action.variant ?? "outline"}
                  size="sm"
                  onClick={() => handleAction(action)}
                  disabled={!!actionLoading}
                  className="border-blue-500/40 text-blue-700 hover:bg-blue-50 dark:border-blue-400/40 dark:text-blue-200 dark:hover:bg-blue-400/20"
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

        <div className="overflow-x-auto rounded-3xl border border-white/20 bg-white/60 shadow-inner dark:border-slate-800/60 dark:bg-slate-950/40">
          <table className="min-w-full divide-y divide-white/20 text-sm dark:divide-slate-800/60">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-white/60 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3">
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          className="flex items-center gap-1 text-left text-xs font-semibold tracking-wide text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300"
                          onClick={header.column.getToggleSortingHandler()}
                          type="button"
                          title="Ordenar columna"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {renderSortIndicator(header.column.id)}
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleLeafColumns().length} className="px-6 py-12 text-center">
                    <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-slate-500 dark:text-slate-300">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-200">
                        <Inbox className="h-6 w-6" />
                      </span>
                      <p className="text-sm font-semibold">{emptyTitle}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{emptyDescription}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "transition-colors hover:bg-blue-50/60 dark:hover:bg-slate-800/50",
                      index % 2 === 0
                        ? "bg-white/80 dark:bg-slate-950/40"
                        : "bg-white/60 dark:bg-slate-900/40"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle text-slate-600 dark:text-slate-200" title={typeof cell.getValue() === "string" ? String(cell.getValue()) : undefined}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/20 pt-4 dark:border-slate-800/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-full border border-white/30 px-4 py-1 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-200"
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-full border border-white/30 px-4 py-1 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-200"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
