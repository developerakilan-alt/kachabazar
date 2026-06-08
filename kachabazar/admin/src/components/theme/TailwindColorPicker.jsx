import React, { useState, useRef, useEffect } from "react";
import { IoChevronDownOutline, IoClose } from "react-icons/io5";
import { TAILWIND_COLORS, FLAT_COLORS } from "@/utils/themeConstants";

/**
 * TailwindColorPicker
 *
 * A visual color palette selector that shows Tailwind CSS colors as swatches.
 * Stores the Tailwind color key (e.g., "emerald-500") as the value.
 */

const POPULAR_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const COLOR_GROUPS = [
  { label: "Gray Scale", colors: ["slate", "gray", "zinc", "neutral"] },
  { label: "Red / Orange", colors: ["red", "orange", "amber", "yellow"] },
  { label: "Green", colors: ["lime", "green", "emerald", "teal"] },
  { label: "Blue / Cyan", colors: ["cyan", "sky", "blue", "indigo"] },
  {
    label: "Purple / Pink",
    colors: ["violet", "purple", "fuchsia", "pink", "rose"],
  },
];

const TailwindColorPicker = ({ value, onChange, label, description }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const currentColor = FLAT_COLORS[value];

  const handleSelect = (colorKey) => {
    onChange(colorKey);
    setIsOpen(false);
    setSearch("");
  };

  const filteredGroups = search
    ? COLOR_GROUPS.map((group) => ({
        ...group,
        colors: group.colors.filter((c) => c.includes(search.toLowerCase())),
      })).filter((g) => g.colors.length > 0)
    : COLOR_GROUPS;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label + description */}
      {label && (
        <div className="mb-1">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground ml-2">
              {description}
            </span>
          )}
        </div>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md bg-card hover:bg-muted transition-colors text-left"
      >
        <div
          className="w-6 h-6 rounded border border-border flex-shrink-0"
          style={{ backgroundColor: currentColor?.hex || "#e5e7eb" }}
        />
        <span className="flex-1 text-foreground truncate">
          {value || "Select a color"}
        </span>
        <IoChevronDownOutline className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[340px] max-h-[420px] overflow-auto bg-card border border-border rounded-lg shadow-xl">
          {/* Search */}
          <div className="sticky top-0 bg-card p-2 border-b border-border">
            <input
              type="text"
              placeholder="Search colors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-border rounded bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>

          {/* B&W */}
          <div className="px-3 pt-2 pb-1">
            <div className="flex items-center gap-2 mb-1">
              <button
                type="button"
                onClick={() => handleSelect("white")}
                className={`w-7 h-7 rounded border-2 transition-all ${
                  value === "white"
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground"
                }`}
                style={{ backgroundColor: "#ffffff" }}
                title="White"
              />
              <button
                type="button"
                onClick={() => handleSelect("black")}
                className={`w-7 h-7 rounded border-2 transition-all ${
                  value === "black"
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground"
                }`}
                style={{ backgroundColor: "#000000" }}
                title="Black"
              />
            </div>
          </div>

          {/* Color groups */}
          {filteredGroups.map((group) => (
            <div key={group.label} className="px-3 py-2">
              <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1.5 tracking-wider">
                {group.label}
              </div>
              {group.colors.map((colorName) => {
                const shades = TAILWIND_COLORS[colorName];
                if (!shades) return null;
                return (
                  <div key={colorName} className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] text-muted-foreground w-12 flex-shrink-0 capitalize">
                      {colorName}
                    </span>
                    <div className="flex gap-0.5 flex-1">
                      {POPULAR_SHADES.map((shade) => {
                        const data = shades[shade];
                        if (!data) return null;
                        const key = `${colorName}-${shade}`;
                        const isSelected = value === key;
                        return (
                          <button
                            type="button"
                            key={shade}
                            onClick={() => handleSelect(key)}
                            className={`w-6 h-6 rounded-sm border transition-all flex-shrink-0 ${
                              isSelected
                                ? "border-primary ring-2 ring-primary/30 dark:ring-primary scale-110"
                                : "border-transparent hover:border-muted-foreground hover:scale-105"
                            }`}
                            style={{ backgroundColor: data.hex }}
                            title={`${key} — ${data.hex}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TailwindColorPicker;
