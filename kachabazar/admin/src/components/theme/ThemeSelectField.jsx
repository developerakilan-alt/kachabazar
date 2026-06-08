import React from "react";
import Select from "react-select";
import { useTheme } from "@/context/ThemeContext";

/**
 * ThemeSelectField
 *
 * A styled react-select dropdown for theme configuration options.
 * Supports optional custom formatOptionLabel for visual previews.
 */
const ThemeSelectField = ({
  label,
  description,
  value,
  onChange,
  options,
  placeholder = "Select...",
  formatOptionLabel,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <div>
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
      <Select
        value={selectedOption}
        onChange={(opt) => onChange(opt?.value || "")}
        options={options}
        placeholder={placeholder}
        isClearable={false}
        isSearchable
        formatOptionLabel={formatOptionLabel}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 99999 }),
          control: (base, state) => ({
            ...base,
            minHeight: "38px",
            fontSize: "14px",
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            borderColor: state.isFocused
              ? "#10b981"
              : isDark
                ? "#4b5563"
                : "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 1px #10b981" : "none",
            "&:hover": {
              borderColor: "#10b981",
            },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
            zIndex: 99999,
          }),
          option: (base, state) => ({
            ...base,
            fontSize: "13px",
            backgroundColor: state.isSelected
              ? isDark
                ? "#065f46"
                : "#d1fae5"
              : state.isFocused
                ? isDark
                  ? "#374151"
                  : "#f3f4f6"
                : "transparent",
            color: state.isSelected
              ? isDark
                ? "#ecfdf5"
                : "#065f46"
              : isDark
                ? "#d1d5db"
                : "#374151",
            "&:active": {
              backgroundColor: isDark ? "#065f46" : "#a7f3d0",
            },
          }),
          singleValue: (base) => ({
            ...base,
            color: isDark ? "#e5e7eb" : "#1f2937",
            fontSize: "14px",
          }),
          input: (base) => ({
            ...base,
            color: isDark ? "#e5e7eb" : "#1f2937",
          }),
          placeholder: (base) => ({
            ...base,
            color: isDark ? "#6b7280" : "#9ca3af",
          }),
          indicatorSeparator: () => ({ display: "none" }),
        }}
      />
    </div>
  );
};

export default ThemeSelectField;
