import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DynamicTableRowActions({ row, actions }) {
  const parsedRow = row.original;

  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            aria-label="Open menu"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          {actions.map((action, index) =>
            action.separator ? (
              <DropdownMenuSeparator key={`sep-${index}`} />
            ) : action.href ? (
              <DropdownMenuItem key={action.key} asChild>
                <Link
                  to={
                    typeof action.href === "function"
                      ? action.href(parsedRow)
                      : action.href
                  }
                  className={action.variant === "delete" ? "text-red-600" : ""}
                >
                  {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                key={action.key}
                onClick={() => action.onClick?.(parsedRow)}
                className={action.variant === "delete" ? "text-red-600" : ""}
              >
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
