import { Checkbox } from "@/components/ui/checkbox";

/**
 * Reusable select/checkbox column for DynamicTable.
 * Add this as the first column in your columns array.
 *
 * Usage:
 *   import { selectColumn } from "@/components/table/selectColumn";
 *   const columns = [selectColumn, ...otherColumns];
 */
export const selectColumn = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="translate-y-[2px]"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="translate-y-[2px]"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};
