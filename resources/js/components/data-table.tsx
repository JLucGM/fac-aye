"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import React from "react"
import { Input } from "./ui/input"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "@inertiajs/react"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  // Props para modo servidor (opcionales)
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
  };
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  initialSearch?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
  onSearch,
  searchPlaceholder = "Buscar...",
  initialSearch = "",
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState(initialSearch)
  const [rowSelection, setRowSelection] = React.useState({})

  // Lógica de búsqueda manual (servidor) o automática (cliente)
  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: handleSearchChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: !!meta, // Importante: desactiva paginación local si hay meta
  })

  return (
    <div className="">
      {/* Solo mostrar buscador si no es modo puramente estático o si se requiere */}
      {(onSearch || columns.some(c => c.enableGlobalFilter !== false)) && (
        <div className="flex items-center py-4">
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ''}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="max-w-full"
          />
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación Híbrida */}
      <div className="flex items-center justify-between py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {meta ? (
            `Mostrando ${meta.from || 0} a ${meta.to || 0} de ${meta.total} resultados`
          ) : (
            `${table.getFilteredRowModel().rows.length} resultado(s)`
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {meta ? (
            // Renderizado de links de Laravel (Servidor)
            <div className="flex items-center space-x-1">
              {meta.links.map((link, i) => {
                const isNextPrev = link.label.includes('Next') || link.label.includes('Previous');
                if (isNextPrev) {
                   return (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      asChild
                      disabled={!link.url}
                    >
                      <Link href={link.url || '#'} preserveScroll className={cn(!link.url && "opacity-50 pointer-events-none")}>
                        {link.label.includes('Previous') ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Link>
                    </Button>
                   )
                }
                if (isNaN(Number(link.label))) return null;
                return (
                  <Button
                    key={i}
                    variant={link.active ? "default" : "outline"}
                    size="sm"
                    asChild
                  >
                    <Link href={link.url || '#'} preserveScroll>
                      {link.label}
                    </Link>
                  </Button>
                )
              })}
            </div>
          ) : (
            // Paginación Local (Cliente)
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
