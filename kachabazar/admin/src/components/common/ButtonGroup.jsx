import { cn } from "@/lib/utils";

export function ButtonGroup({ children, className }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>{children}</div>
  );
}
