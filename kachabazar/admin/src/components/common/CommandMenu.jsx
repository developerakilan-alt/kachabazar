import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearch } from "@/context/SearchContext";
import { sidebarData } from "@/data/sidebar-data";

export function CommandMenu() {
  const navigate = useNavigate();
  const { open, setOpen } = useSearch();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = useCallback(
    (command) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  // Flatten sidebar items for search
  const searchableItems = useMemo(() => {
    const items = [];
    sidebarData.navGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.url) {
          items.push({
            title: item.title,
            url: item.url,
            group: group.title,
          });
        }
        if (item.items) {
          item.items.forEach((sub) => {
            items.push({
              title: `${item.title} → ${sub.title}`,
              url: sub.url,
              group: group.title,
            });
          });
        }
      });
    });
    return items;
  }, []);

  // Group items by their group title
  const groupedItems = useMemo(() => {
    const groups = {};
    searchableItems.forEach((item) => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    return groups;
  }, [searchableItems]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groupedItems).map(([group, items], idx) => (
          <CommandGroup key={group} heading={group}>
            {items.map((item) => (
              <CommandItem
                key={item.url}
                value={item.title}
                onSelect={() => runCommand(() => navigate(item.url))}
              >
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
