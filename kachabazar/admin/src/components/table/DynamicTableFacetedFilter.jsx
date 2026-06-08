import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

/**
 * Faceted filter supporting both client-side (column) and server-side (value/onChange) modes.
 *
 * Client-side: pass `column` prop (TanStack column instance).
 * Server-side: pass `value` (string) and `onChange` (callback) props.
 *   - value="" means "all" (no filter), otherwise a single-select string value.
 */
export function DynamicTableFacetedFilter({
  column,
  title,
  options = [],
  // Server-side props (single-select string mode)
  value: serverValue,
  onChange: serverOnChange,
}) {
  // Determine mode
  const isServerSide = serverOnChange != null;

  // Client-side: multi-select Set from column filter
  const facets = column?.getFacetedUniqueValues?.();
  const clientSelected = new Set(column?.getFilterValue() ?? []);

  const toggleClientValue = (val) => {
    const newSelected = new Set(clientSelected);
    if (newSelected.has(val)) {
      newSelected.delete(val);
    } else {
      newSelected.add(val);
    }
    const values = Array.from(newSelected);
    column.setFilterValue(values.length ? values : undefined);
  };

  // Server-side: single-select string
  const handleServerSelect = (val) => {
    if (serverValue === val) {
      // Deselect → reset to empty (all)
      serverOnChange("");
    } else {
      serverOnChange(val);
    }
  };

  // Compute selected display
  const selectedOptions = isServerSide
    ? serverValue
      ? options.filter((opt) => opt.value === serverValue)
      : []
    : options.filter((opt) => clientSelected.has(opt.value));

  const selectedCount = selectedOptions.length;
  const hasFilter = isServerSide ? !!serverValue : clientSelected.size > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          <span>{title}</span>
          {selectedCount > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedCount}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedCount > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedCount} selected
                  </Badge>
                ) : (
                  selectedOptions.map((opt) => (
                    <Badge
                      key={String(opt.value)}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {opt.label}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = isServerSide
                  ? serverValue === option.value
                  : clientSelected.has(option.value);
                return (
                  <CommandItem
                    key={String(option.value)}
                    onSelect={() =>
                      isServerSide
                        ? handleServerSelect(option.value)
                        : toggleClientValue(option.value)
                    }
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                    )}
                    <span>{option.label}</span>
                    {!isServerSide && facets?.get(option.value) && (
                      <span className="ml-auto font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {hasFilter && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() =>
                      isServerSide
                        ? serverOnChange("")
                        : column?.setFilterValue(undefined)
                    }
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
