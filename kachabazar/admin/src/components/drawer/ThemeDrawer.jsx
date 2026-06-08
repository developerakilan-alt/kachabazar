import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useTranslation } from "react-i18next";
import { FiInfo } from "react-icons/fi";

import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import LabelArea from "@/components/form/selectOption/LabelArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import useThemeSubmit from "@/hooks/useThemeSubmit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import TailwindColorPicker from "@/components/theme/TailwindColorPicker";
import ThemeSelectField from "@/components/theme/ThemeSelectField";
import {
  COLOR_ROLE_INFO,
  COLOR_PRESETS,
  DARK_COLOR_PRESETS,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  RADIUS_OPTIONS,
  BORDER_WIDTH_OPTIONS,
  BORDER_STYLE_OPTIONS,
  SIDEBAR_WIDTH_OPTIONS,
  HEADER_HEIGHT_OPTIONS,
  getHexFromKey,
} from "@/utils/themeConstants";

const TABS = [
  { key: "General", label: "General" },
  { key: "Colors", label: "Light Colors" },
  { key: "DarkColors", label: "Dark Colors" },
  { key: "Typography", label: "Typography" },
  { key: "Sizing", label: "Radius & Borders" },
  { key: "Layout", label: "Layout" },
  { key: "Preview", label: "Preview" },
];

// Friendly label from camelCase
const toLabel = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

// ─── Color Preset Bar ──────────────────────────────────────────────────
const PresetBar = ({ presets, onApply }) => (
  <div className="mb-5">
    <p className="text-xs font-medium text-muted-foreground mb-2">
      Quick Presets
    </p>
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.name}
          type="button"
          onClick={() => onApply(preset)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary hover:text-primary transition-colors"
        >
          <span
            className="w-3 h-3 rounded-full border border-border inline-block"
            style={{ backgroundColor: getHexFromKey(preset.primary) }}
          />
          {preset.name}
        </button>
      ))}
    </div>
  </div>
);

// ─── Color Section ─────────────────────────────────────────────────────
const ColorSection = ({ title, colorMap, onColorChange }) => {
  // Group colors logically
  const groups = [
    {
      title: "Brand",
      keys: ["primary", "primaryForeground", "ring"],
    },
    {
      title: "Backgrounds",
      keys: ["background", "foreground", "card", "cardForeground"],
    },
    {
      title: "UI Elements",
      keys: [
        "secondary",
        "secondaryForeground",
        "accent",
        "accentForeground",
        "muted",
        "mutedForeground",
      ],
    },
    {
      title: "Borders & Input",
      keys: ["border", "input"],
    },
    {
      title: "Destructive",
      keys: ["destructive", "destructiveForeground"],
    },
    {
      title: "Popover",
      keys: ["popover", "popoverForeground"],
    },
  ];

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {groups.map((group) => (
        <div
          key={group.title}
          className="bg-card rounded-lg p-4 border border-border"
        >
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {group.title}
          </h4>
          <div className="space-y-3">
            {group.keys
              .filter((k) => colorMap[k])
              .map((key) => (
                <div key={key} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-foreground">
                        {toLabel(key)}
                      </span>
                      {COLOR_ROLE_INFO[key] && (
                        <span
                          className="text-muted-foreground cursor-help"
                          title={COLOR_ROLE_INFO[key]}
                        >
                          <FiInfo className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-8">
                    <TailwindColorPicker
                      value={colorMap[key]?.key || ""}
                      onChange={(colorKey) => onColorChange(key, colorKey)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── CSS Variables Preview ─────────────────────────────────────────────
const CSSPreview = ({ colors, darkColors, typography, sizing, borders }) => {
  const lightVars = Object.entries(colors)
    .map(([key, val]) => {
      const varName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      return `  ${varName}: ${val.hsl};`;
    })
    .join("\n");

  const darkVars = Object.entries(darkColors)
    .map(([key, val]) => {
      const varName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      return `  ${varName}: ${val.hsl};`;
    })
    .join("\n");

  const typographyVars = `  --font-family: ${typography.fontFamily};\n  --font-size-base: ${typography.fontSizeBase};`;
  const radiusVars = `  --radius: ${sizing.radius};`;

  return (
    <div className="space-y-4">
      {/* Visual preview */}
      <div className="bg-card rounded-lg p-5 border border-border">
        <h4 className="text-sm font-semibold text-foreground mb-4">
          Theme Preview
        </h4>
        <div className="space-y-4">
          {/* Color palette swatches */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Color Palette</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(colors).map(([key, val]) => (
                <div key={key} className="text-center">
                  <div
                    className="w-10 h-10 rounded-md border border-border"
                    style={{ backgroundColor: `hsl(${val.hsl})` }}
                    title={`${toLabel(key)}: ${val.key}`}
                  />
                  <p className="text-[9px] text-muted-foreground mt-0.5 truncate max-w-[40px]">
                    {key.replace(/Foreground/, "Fg")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sample UI elements */}
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: `hsl(${colors.background?.hsl})`,
              borderColor: `hsl(${colors.border?.hsl})`,
              color: `hsl(${colors.foreground?.hsl})`,
              fontFamily: typography.fontFamily,
              borderRadius: sizing.radius,
            }}
          >
            <div
              className="px-4 py-2 rounded text-sm font-medium inline-block mb-2"
              style={{
                backgroundColor: `hsl(${colors.primary?.hsl})`,
                color: `hsl(${colors.primaryForeground?.hsl})`,
                borderRadius: sizing.radiusMd,
              }}
            >
              Primary Button
            </div>
            <div
              className="px-4 py-2 rounded text-sm font-medium inline-block ml-2 mb-2 border"
              style={{
                backgroundColor: `hsl(${colors.secondary?.hsl})`,
                color: `hsl(${colors.secondaryForeground?.hsl})`,
                borderColor: `hsl(${colors.border?.hsl})`,
                borderRadius: sizing.radiusMd,
              }}
            >
              Secondary
            </div>
            <div
              className="px-4 py-2 rounded text-sm font-medium inline-block ml-2 mb-2"
              style={{
                backgroundColor: `hsl(${colors.destructive?.hsl})`,
                color: `hsl(${colors.destructiveForeground?.hsl})`,
                borderRadius: sizing.radiusMd,
              }}
            >
              Destructive
            </div>
            <div
              className="mt-2 p-3 rounded border"
              style={{
                backgroundColor: `hsl(${colors.card?.hsl})`,
                borderColor: `hsl(${colors.border?.hsl})`,
                borderRadius: sizing.radiusLg,
              }}
            >
              <p
                className="text-sm mb-1"
                style={{ color: `hsl(${colors.cardForeground?.hsl})` }}
              >
                Card content with{" "}
                <span style={{ color: `hsl(${colors.mutedForeground?.hsl})` }}>
                  muted text
                </span>
              </p>
              <div
                className="h-8 rounded border px-3 flex items-center text-sm"
                style={{
                  borderColor: `hsl(${colors.input?.hsl})`,
                  backgroundColor: `hsl(${colors.background?.hsl})`,
                  color: `hsl(${colors.mutedForeground?.hsl})`,
                  borderRadius: sizing.radiusSm,
                }}
              >
                Input placeholder...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS output */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-3 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground">
            Generated CSS Variables
          </h4>
        </div>
        <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto max-h-64">
          {`:root {\n${lightVars}\n${typographyVars}\n${radiusVars}\n}\n\n.dark {\n${darkVars}\n}`}
        </pre>
      </div>
    </div>
  );
};

// ─── Main Drawer ───────────────────────────────────────────────────────
const ThemeDrawer = ({ id }) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    watch,
    setValue,
    colors,
    darkColors,
    updateColor,
    updateDarkColor,
    applyColorPreset,
    typography,
    setTypography,
    sizing,
    setSizing,
    borders,
    setBorders,
    sidebar,
    setSidebar,
    updateSidebarColor,
    header,
    setHeader,
    updateHeaderColor,
    tapValue,
    setTapValue,
  } = useThemeSubmit(id);

  const isDefault = watch("isDefault");

  const updateTypo = (key, value) =>
    setTypography((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="flex flex-col h-full">
      <div className="w-full relative px-6 py-4 border-b bg-muted">
        <Title
          title={id ? "Update Theme" : "Add Theme"}
          description={
            id
              ? "Update your theme configuration and styling"
              : "Create a new theme with custom colors, typography, and layout"
          }
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <Scrollbars className="flex-1 mb-8 bg-card text-card-foreground">
          <div className="px-6 pt-8 pb-6 flex-grow w-full h-full max-h-full">
            {/* ── Tab Navigation ─────────────────────────────── */}
            <div className="mb-6 border-b border-border overflow-x-auto">
              <div className="flex -mb-px min-w-max">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setTapValue(tab.key)}
                    className={`mr-1 inline-block px-3 py-2.5 text-xs font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                      tapValue === tab.key
                        ? "text-primary border-primary  "
                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── General Tab ────────────────────────────────── */}
            {tapValue === "General" && (
              <div className="space-y-5">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                  <LabelArea label="Theme Name" />
                  <div className="col-span-8 sm:col-span-4">
                    <Input
                      {...register("name", {
                        required: "Theme name is required",
                      })}
                      type="text"
                      placeholder="e.g. Emerald Default"
                    />
                    <Error errorName={errors.name} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                  <LabelArea label="Description" />
                  <div className="col-span-8 sm:col-span-4">
                    <Textarea
                      {...register("description")}
                      rows={3}
                      placeholder="Theme description (optional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                  <LabelArea label="Set as Default" />
                  <div className="col-span-8 sm:col-span-4">
                    <SwitchToggle
                      title=""
                      processOption={isDefault || false}
                      handleProcess={(val) => setValue("isDefault", val)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Light Colors Tab ───────────────────────────── */}
            {tapValue === "Colors" && (
              <>
                <PresetBar
                  presets={COLOR_PRESETS}
                  onApply={(p) => applyColorPreset(p, false)}
                />
                <ColorSection
                  title="Light Mode Colors"
                  colorMap={colors}
                  onColorChange={updateColor}
                />
              </>
            )}

            {/* ── Dark Colors Tab ────────────────────────────── */}
            {tapValue === "DarkColors" && (
              <>
                <PresetBar
                  presets={DARK_COLOR_PRESETS}
                  onApply={(p) => applyColorPreset(p, true)}
                />
                <ColorSection
                  title="Dark Mode Colors"
                  colorMap={darkColors}
                  onColorChange={updateDarkColor}
                />
              </>
            )}

            {/* ── Typography Tab ─────────────────────────────── */}
            {tapValue === "Typography" && (
              <div className="space-y-5">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Font Family
                  </h4>
                  <ThemeSelectField
                    label="Font Family"
                    value={typography.fontFamily}
                    onChange={(val) => updateTypo("fontFamily", val)}
                    options={FONT_FAMILY_OPTIONS}
                  />

                  {/* Preview of selected font */}
                  <div
                    className="mt-3 p-3 bg-muted rounded-md"
                    style={{ fontFamily: typography.fontFamily }}
                  >
                    <p className="text-lg font-bold">
                      The quick brown fox jumps over the lazy dog
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      0123456789 — {typography.fontFamily}
                    </p>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Font Sizes
                  </h4>
                  <div className="space-y-3">
                    <ThemeSelectField
                      label="Base Size"
                      value={typography.fontSizeBase}
                      onChange={(val) => updateTypo("fontSizeBase", val)}
                      options={FONT_SIZE_OPTIONS}
                    />
                    <ThemeSelectField
                      label="Small (sm)"
                      value={typography.fontSizeSm}
                      onChange={(val) => updateTypo("fontSizeSm", val)}
                      options={FONT_SIZE_OPTIONS}
                    />
                    <ThemeSelectField
                      label="Large (lg)"
                      value={typography.fontSizeLg}
                      onChange={(val) => updateTypo("fontSizeLg", val)}
                      options={FONT_SIZE_OPTIONS}
                    />
                    <ThemeSelectField
                      label="Extra Large (xl)"
                      value={typography.fontSizeXl}
                      onChange={(val) => updateTypo("fontSizeXl", val)}
                      options={FONT_SIZE_OPTIONS}
                    />
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Weights & Line Height
                  </h4>
                  <div className="space-y-3">
                    <ThemeSelectField
                      label="Normal Weight"
                      value={typography.fontWeightNormal}
                      onChange={(val) => updateTypo("fontWeightNormal", val)}
                      options={FONT_WEIGHT_OPTIONS}
                    />
                    <ThemeSelectField
                      label="Medium Weight"
                      value={typography.fontWeightMedium}
                      onChange={(val) => updateTypo("fontWeightMedium", val)}
                      options={FONT_WEIGHT_OPTIONS}
                    />
                    <ThemeSelectField
                      label="Bold Weight"
                      value={typography.fontWeightBold}
                      onChange={(val) => updateTypo("fontWeightBold", val)}
                      options={FONT_WEIGHT_OPTIONS}
                    />
                    <ThemeSelectField
                      label="Line Height"
                      value={typography.lineHeight}
                      onChange={(val) => updateTypo("lineHeight", val)}
                      options={LINE_HEIGHT_OPTIONS}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Radius & Borders Tab ───────────────────────── */}
            {tapValue === "Sizing" && (
              <div className="space-y-5">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Border Radius
                  </h4>
                  <div className="space-y-3">
                    <ThemeSelectField
                      label="Default Radius"
                      value={sizing.radius}
                      onChange={(val) =>
                        setSizing((prev) => ({ ...prev, radius: val }))
                      }
                      options={RADIUS_OPTIONS}
                    />
                    <ThemeSelectField
                      label="Small (sm)"
                      value={sizing.radiusSm}
                      onChange={(val) =>
                        setSizing((prev) => ({ ...prev, radiusSm: val }))
                      }
                      options={RADIUS_OPTIONS}
                    />
                    <ThemeSelectField
                      label="Medium (md)"
                      value={sizing.radiusMd}
                      onChange={(val) =>
                        setSizing((prev) => ({ ...prev, radiusMd: val }))
                      }
                      options={RADIUS_OPTIONS}
                    />
                    <ThemeSelectField
                      label="Large (lg)"
                      value={sizing.radiusLg}
                      onChange={(val) =>
                        setSizing((prev) => ({ ...prev, radiusLg: val }))
                      }
                      options={RADIUS_OPTIONS}
                    />
                    <ThemeSelectField
                      label="Extra Large (xl)"
                      value={sizing.radiusXl}
                      onChange={(val) =>
                        setSizing((prev) => ({ ...prev, radiusXl: val }))
                      }
                      options={RADIUS_OPTIONS}
                    />
                  </div>

                  {/* Visual radius preview */}
                  <div className="mt-4 flex gap-3 items-end">
                    {[
                      { label: "sm", val: sizing.radiusSm },
                      { label: "md", val: sizing.radiusMd },
                      { label: "default", val: sizing.radius },
                      { label: "lg", val: sizing.radiusLg },
                      { label: "xl", val: sizing.radiusXl },
                    ].map((r) => (
                      <div key={r.label} className="text-center">
                        <div
                          className="w-12 h-12 bg-primary "
                          style={{ borderRadius: r.val }}
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {r.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Borders
                  </h4>
                  <div className="space-y-3">
                    <ThemeSelectField
                      label="Border Width"
                      value={borders.borderWidth}
                      onChange={(val) =>
                        setBorders((prev) => ({ ...prev, borderWidth: val }))
                      }
                      options={BORDER_WIDTH_OPTIONS}
                    />
                    <ThemeSelectField
                      label="Border Style"
                      value={borders.borderStyle}
                      onChange={(val) =>
                        setBorders((prev) => ({ ...prev, borderStyle: val }))
                      }
                      options={BORDER_STYLE_OPTIONS}
                    />
                  </div>

                  {/* Border preview */}
                  <div className="mt-4">
                    <div
                      className="h-16 rounded-lg"
                      style={{
                        borderWidth: borders.borderWidth,
                        borderStyle: borders.borderStyle,
                        borderColor: `hsl(${colors.border?.hsl || "214.3 31.8% 91.4%"})`,
                        borderRadius: sizing.radius,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Layout Tab ─────────────────────────────────── */}
            {tapValue === "Layout" && (
              <div className="space-y-5">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Sidebar
                  </h4>
                  <div className="space-y-3">
                    <ThemeSelectField
                      label="Sidebar Width"
                      value={sidebar.width}
                      onChange={(val) =>
                        setSidebar((prev) => ({ ...prev, width: val }))
                      }
                      options={SIDEBAR_WIDTH_OPTIONS}
                    />
                    <div className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-4">
                        <span className="text-sm text-foreground">
                          Background
                        </span>
                      </div>
                      <div className="col-span-8">
                        <TailwindColorPicker
                          value={sidebar.bgColor?.key || ""}
                          onChange={(key) => updateSidebarColor("bgColor", key)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-4">
                        <span className="text-sm text-foreground">
                          Text Color
                        </span>
                      </div>
                      <div className="col-span-8">
                        <TailwindColorPicker
                          value={sidebar.textColor?.key || ""}
                          onChange={(key) =>
                            updateSidebarColor("textColor", key)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-4">
                        <span className="text-sm text-foreground">
                          Active Color
                        </span>
                      </div>
                      <div className="col-span-8">
                        <TailwindColorPicker
                          value={sidebar.activeColor?.key || ""}
                          onChange={(key) =>
                            updateSidebarColor("activeColor", key)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Header
                  </h4>
                  <div className="space-y-3">
                    <ThemeSelectField
                      label="Header Height"
                      value={header.height}
                      onChange={(val) =>
                        setHeader((prev) => ({ ...prev, height: val }))
                      }
                      options={HEADER_HEIGHT_OPTIONS}
                    />
                    <div className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-4">
                        <span className="text-sm text-foreground">
                          Background
                        </span>
                      </div>
                      <div className="col-span-8">
                        <TailwindColorPicker
                          value={header.bgColor?.key || ""}
                          onChange={(key) => updateHeaderColor("bgColor", key)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-4">
                        <span className="text-sm text-foreground">
                          Text Color
                        </span>
                      </div>
                      <div className="col-span-8">
                        <TailwindColorPicker
                          value={header.textColor?.key || ""}
                          onChange={(key) =>
                            updateHeaderColor("textColor", key)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layout wireframe preview */}
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Layout Preview
                  </h4>
                  <div
                    className="border border-border rounded-lg overflow-hidden flex"
                    style={{ height: "200px" }}
                  >
                    {/* Sidebar mock */}
                    <div
                      className="flex-shrink-0 flex flex-col p-2"
                      style={{
                        width: "60px",
                        backgroundColor: `hsl(${sidebar.bgColor?.hsl || "215 27.9% 16.9%"})`,
                        color: `hsl(${sidebar.textColor?.hsl || "220 13% 91%"})`,
                      }}
                    >
                      <div className="w-6 h-6 rounded bg-white/10 mb-2" />
                      <div className="w-full h-2 rounded bg-white/20 mb-1.5" />
                      <div className="w-full h-2 rounded bg-white/20 mb-1.5" />
                      <div
                        className="w-full h-2 rounded mb-1.5"
                        style={{
                          backgroundColor: `hsl(${sidebar.activeColor?.hsl || "160.1 84.1% 39.4%"})`,
                        }}
                      />
                      <div className="w-full h-2 rounded bg-white/20 mb-1.5" />
                    </div>
                    {/* Main area */}
                    <div className="flex-1 flex flex-col">
                      {/* Header mock */}
                      <div
                        className="flex-shrink-0 p-2 flex items-center gap-2 border-b border-border"
                        style={{
                          height: "32px",
                          backgroundColor: `hsl(${header.bgColor?.hsl || "0 0% 100%"})`,
                        }}
                      >
                        <div className="w-16 h-2 rounded bg-border" />
                        <div className="flex-1" />
                        <div className="w-4 h-4 rounded-full bg-border" />
                      </div>
                      {/* Content mock */}
                      <div className="flex-1 p-3 bg-muted">
                        <div className="w-24 h-2 rounded bg-border mb-2" />
                        <div className="w-full h-16 rounded bg-card border border-border" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Preview Tab ────────────────────────────────── */}
            {tapValue === "Preview" && (
              <CSSPreview
                colors={colors}
                darkColors={darkColors}
                typography={typography}
                sizing={sizing}
                borders={borders}
              />
            )}
          </div>
        </Scrollbars>

        <DrawerButton id={id} title="Theme" isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default ThemeDrawer;
