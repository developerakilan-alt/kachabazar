import { cn } from "@/lib/utils";

export function SectionTitle({ title, description, className }) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
}
