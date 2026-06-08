import { useCallback } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DynamicTableFacetedFilter } from "./DynamicTableFacetedFilter";
import { DynamicTableViewOptions } from "./DynamicTableViewOptions";

/**
 * Toolbar supporting both client-side and server-side modes.
 *
 * Client-side filters: { columnId, title, options }
 * Server-side filters: { title, options, value, onChange }
 */
export function DynamicTableToolbar({
  table,
  filters = [],
  searchColumns = ["name"],
  searchText: externalSearchText = "",
  onSearchChange,
  searchPlaceholder,
  // Server-side reset callback (resets all server-side filters + search)
  onReset,
}) {
  const hasColumnFilters = table.getState().columnFilters.length > 0;
  const hasServerFilters = filters.some((f) => f.onChange && f.value);
  const hasSearchText = externalSearchText && externalSearchText.length > 0;
  const isFiltered = hasColumnFilters || hasServerFilters || hasSearchText;

  // Handle search
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      onSearchChange?.(value);
    },
    [onSearchChange],
  );

  const handleReset = useCallback(() => {
    table.resetColumnFilters();
    onSearchChange?.("");
    onReset?.();
  }, [table, onSearchChange, onReset]);

  const placeholder =
    searchPlaceholder || `Search ${searchColumns.join(", ")}...`;

  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={externalSearchText}
            onChange={handleSearchChange}
            className="h-8 max-w-lg min-w-[150px] grow pl-8 lg:min-w-[250px]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter, idx) => {
            // Server-side filter: has value/onChange
            if (filter.onChange) {
              return (
                <DynamicTableFacetedFilter
                  key={filter.title || idx}
                  title={filter.title}
                  options={filter.options}
                  value={filter.value}
                  onChange={filter.onChange}
                />
              );
            }
            // Client-side filter: has columnId
            const col = table.getColumn(filter.columnId);
            return (
              col && (
                <DynamicTableFacetedFilter
                  key={filter.columnId}
                  column={col}
                  title={filter.title}
                  options={filter.options}
                />
              )
            );
          })}
        </div>

        {isFiltered && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex h-8 items-center gap-1 px-2 lg:px-3"
          >
            Reset <Cross2Icon className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="shrink-0">
        <DynamicTableViewOptions table={table} />
      </div>
    </div>
  );
}
