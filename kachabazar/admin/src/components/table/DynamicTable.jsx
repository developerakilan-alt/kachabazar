import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DynamicTablePagination } from "./DynamicTablePagination";
import { DynamicTableToolbar } from "./DynamicTableToolbar";
import { DynamicTableViewOptions } from "./DynamicTableViewOptions";
import notFoundImg from "@/assets/img/no-result.svg";

// Custom global filter function: searches across specified columns
const globalFilterFn = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  const search = filterValue.toLowerCase();
  // Search across all string columns
  const values = Object.values(row.original);
  return values.some((val) => {
    if (val == null) return false;
    if (typeof val === "string") return val.toLowerCase().includes(search);
    if (typeof val === "number") return String(val).includes(search);
    return false;
  });
};

export function DynamicTable({
  data = [],
  columns = [],
  loading = false,
  // Toolbar
  filters = [],
  searchColumns = ["name"],
  searchPlaceholder,
  searchText = "",
  onSearchChange,
  onReset,
  header = true,
  footer = true,
  // View options (column visibility toggle) — shown even when header={false}
  showViewOptions = false,
  // Selection
  setSelectedIds,
  enableRowSelection = true,
  // Sorting/Filters/Visibility from parent
  sorting: externalSorting,
  setSorting: externalSetSorting,
  columnFilters: externalColumnFilters,
  setColumnFilters: externalSetColumnFilters,
  columnVisibility: externalColumnVisibility,
  setColumnVisibility: externalSetColumnVisibility,
  rowSelection: externalRowSelection,
  setRowSelection: externalSetRowSelection,
  // Server-side pagination
  serverSide = false,
  totalCount = 0,
  totalPages = 1,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) {
  // Internal state (used when no external state is provided)
  const [internalSorting, setInternalSorting] = useState([]);
  const [internalColumnFilters, setInternalColumnFilters] = useState([]);
  const [internalColumnVisibility, setInternalColumnVisibility] = useState({});
  const [internalRowSelection, setInternalRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Use external state if provided, otherwise internal
  const sorting = externalSorting ?? internalSorting;
  const setSorting = externalSetSorting ?? setInternalSorting;
  const columnFilters = externalColumnFilters ?? internalColumnFilters;
  const setColumnFilters = externalSetColumnFilters ?? setInternalColumnFilters;
  const columnVisibility = externalColumnVisibility ?? internalColumnVisibility;
  const setColumnVisibility =
    externalSetColumnVisibility ?? setInternalColumnVisibility;
  const rowSelection = externalRowSelection ?? internalRowSelection;
  const setRowSelection = externalSetRowSelection ?? setInternalRowSelection;

  // Handle search from toolbar
  const handleSearchChange = useCallback((value) => {
    setGlobalFilter(value);
  }, []);

  // Stable pagination state for server-side
  const paginationState = useMemo(
    () => (serverSide ? { pageIndex: currentPage - 1, pageSize } : undefined),
    [serverSide, currentPage, pageSize],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sorting || [],
      columnFilters: columnFilters || [],
      columnVisibility: columnVisibility || {},
      rowSelection: rowSelection || {},
      globalFilter,
      ...(paginationState ? { pagination: paginationState } : {}),
    },
    ...(serverSide
      ? {
          pageCount: totalPages,
          manualPagination: true,
          manualFiltering: true,
          manualSorting: true,
        }
      : {}),
    globalFilterFn: serverSide ? undefined : globalFilterFn,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
    },
    onColumnFiltersChange: (updater) => {
      const newFilters =
        typeof updater === "function" ? updater(columnFilters) : updater;
      setColumnFilters(newFilters);
    },
    onColumnVisibilityChange: setColumnVisibility,
    ...(serverSide
      ? {
          onPaginationChange: (updater) => {
            const old = { pageIndex: currentPage - 1, pageSize };
            const newPag =
              typeof updater === "function" ? updater(old) : updater;
            if (newPag.pageIndex !== old.pageIndex && onPageChange) {
              onPageChange(newPag.pageIndex + 1);
            }
            if (newPag.pageSize !== old.pageSize && onPageSizeChange) {
              onPageSizeChange(newPag.pageSize);
            }
          },
        }
      : {}),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: serverSide ? undefined : getSortedRowModel(),
    getFilteredRowModel: serverSide ? undefined : getFilteredRowModel(),
    getFacetedRowModel: serverSide ? undefined : getFacetedRowModel(),
    getFacetedUniqueValues: serverSide ? undefined : getFacetedUniqueValues(),
    getPaginationRowModel: serverSide ? undefined : getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Sync selected IDs to parent — use ref to avoid infinite loop
  const setSelectedIdsRef = useRef(setSelectedIds);
  setSelectedIdsRef.current = setSelectedIds;

  useEffect(() => {
    if (!setSelectedIdsRef.current) return;
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original._id);
    setSelectedIdsRef.current(selectedIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  return (
    <div className="space-y-4">
      {header && (
        <DynamicTableToolbar
          table={table}
          filters={filters}
          searchColumns={searchColumns}
          searchPlaceholder={searchPlaceholder}
          searchText={onSearchChange ? searchText : globalFilter}
          onSearchChange={onSearchChange || handleSearchChange}
          onReset={onReset}
        />
      )}

      {!header && showViewOptions && (
        <div className="flex justify-end">
          <DynamicTableViewOptions table={table} />
        </div>
      )}

      <div className="rounded-md border bg-card">
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
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(pageSize > 5 ? 8 : pageSize)].map((_, i) => (
                <TableRow key={`loading-${i}`}>
                  {columns.map((_, index) => (
                    <TableCell key={index}>
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center"
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <img
                      src={notFoundImg}
                      alt="No data"
                      className="h-32 w-32 opacity-50"
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No data found.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {footer && (
        <DynamicTablePagination
          table={table}
          totalCount={serverSide ? totalCount : undefined}
        />
      )}
    </div>
  );
}
