import { useCallback } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeServices from "@/services/ThemeServices";
import { notifySuccess, notifyError } from "@/utils/toast";

// Convert HSL string "H S% L%" to a hex-ish CSS color for preview dots
const hslToStyle = (hslStr) => {
  if (!hslStr) return "transparent";
  return `hsl(${hslStr})`;
};

const getColor = (token) => {
  if (!token) return "transparent";
  return hslToStyle(token.hsl || token);
};

export function ThemePicker() {
  const queryClient = useQueryClient();

  const { data: themes } = useQuery({
    queryKey: ["themes-show"],
    queryFn: ThemeServices.getShowingThemes,
    staleTime: 5 * 60 * 1000,
  });

  const { data: activeTheme } = useQuery({
    queryKey: ["active-theme-default"],
    queryFn: ThemeServices.getDefaultTheme,
    staleTime: 10 * 60 * 1000,
  });

  const handleSetDefault = useCallback(
    async (id) => {
      if (id === activeTheme?._id) return;
      try {
        const res = await ThemeServices.setDefaultTheme(id);
        notifySuccess(res?.message || "Theme applied!");
        // Invalidate both queries so UI refreshes immediately
        queryClient.invalidateQueries({ queryKey: ["themes"] });
        queryClient.invalidateQueries({ queryKey: ["themes-show"] });
        queryClient.invalidateQueries({ queryKey: ["active-theme-default"] });
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      }
    },
    [activeTheme, queryClient],
  );

  const themeList = Array.isArray(themes) ? themes : [];

  if (themeList.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex gap-1.5 rounded-full px-2 h-9"
        >
          <div
            className="h-4 w-4 rounded-full border border-border"
            style={{
              backgroundColor: getColor(activeTheme?.colors?.primary),
            }}
          />
          <FiChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Switch Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themeList.map((theme) => {
          const isActive = theme._id === activeTheme?._id;
          return (
            <DropdownMenuItem
              key={theme._id}
              onClick={() => handleSetDefault(theme._id)}
              className={cn(
                "flex items-center gap-3 cursor-pointer",
                isActive && "bg-accent",
              )}
            >
              {/* Color preview dots */}
              <div className="flex -space-x-1">
                {[
                  theme.colors?.primary,
                  theme.colors?.accent,
                  theme.colors?.destructive,
                ].map((color, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-full border-2 border-background"
                    style={{ backgroundColor: getColor(color) }}
                  />
                ))}
              </div>
              {/* Name */}
              <span className="flex-1 text-sm truncate">
                {typeof theme.name === "object"
                  ? theme.name?.en || theme.name
                  : theme.name}
              </span>
              {/* Active check */}
              {isActive && (
                <FiCheck className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
