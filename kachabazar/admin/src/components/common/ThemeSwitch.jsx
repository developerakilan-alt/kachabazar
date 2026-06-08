import { useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

export function ThemeSwitch({ variant = "ghost", className }) {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  useEffect(() => {
    const themeColor = isDark ? "#020817" : "#ffffff";
    const meta = document.querySelector("meta[name='theme-color']");
    if (meta) meta.setAttribute("content", themeColor);
  }, [isDark]);

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={cn("scale-95 rounded-full", className)}
    >
      <FiSun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <FiMoon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
