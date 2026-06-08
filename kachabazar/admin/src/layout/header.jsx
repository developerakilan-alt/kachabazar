import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = ({ className, fixed, children, ...props }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "bg-card flex h-16 items-center gap-3 border-b border-border p-4 sm:gap-4",
        fixed &&
          "header-fixed peer/header fixed z-50 w-[inherit] rounded-md rounded-t-none",
        offset > 10 && fixed ? "shadow-xs" : "shadow-xs",
        className,
      )}
      {...props}
    >
      <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
      <Separator orientation="vertical" className="h-6" />
      {children}
    </header>
  );
};

Header.displayName = "Header";
