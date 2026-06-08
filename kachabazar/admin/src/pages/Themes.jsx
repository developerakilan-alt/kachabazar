import React, { useContext, useMemo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiPlus,
  FiTrash2,
  FiStar,
  FiEye,
  FiEyeOff,
  FiEdit2,
  FiGrid,
  FiList,
  FiSearch,
  FiCheck,
  FiMoreVertical,
  FiDownload,
} from "react-icons/fi";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// internal imports
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import AnimatedContent from "@/components/common/AnimatedContent";
import ThemeDrawer from "@/components/drawer/ThemeDrawer";
import ThemeServices from "@/services/ThemeServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useAction } from "@/context/ActionContext";
import { SidebarContext } from "@/context/SidebarContext";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { getHexFromKey } from "@/utils/themeConstants";

// ─── Theme Preview Card ───────────────────────────────────────────────
const ThemeCard = ({
  theme,
  onEdit,
  onDelete,
  onSetDefault,
  onToggleStatus,
  showingTranslateValue,
}) => {
  const colors = theme.colors || {};
  const primaryHex =
    getHexFromKey(colors.primary?.key) ||
    `hsl(${colors.primary?.hsl || "160.1 84.1% 39.4%"})`;
  const secondaryHex =
    getHexFromKey(colors.secondary?.key) ||
    `hsl(${colors.secondary?.hsl || "210 40% 96.1%"})`;
  const accentHex =
    getHexFromKey(colors.accent?.key) ||
    `hsl(${colors.accent?.hsl || "210 40% 96.1%"})`;
  const bgHex =
    getHexFromKey(colors.background?.key) ||
    `hsl(${colors.background?.hsl || "0 0% 100%"})`;
  const fgHex =
    getHexFromKey(colors.foreground?.key) ||
    `hsl(${colors.foreground?.hsl || "222.2 84% 4.9%"})`;
  const destructiveHex =
    getHexFromKey(colors.destructive?.key) ||
    `hsl(${colors.destructive?.hsl || "0 84.2% 60.2%"})`;
  const mutedHex =
    getHexFromKey(colors.muted?.key) ||
    `hsl(${colors.muted?.hsl || "210 40% 96.1%"})`;
  const borderHex =
    getHexFromKey(colors.border?.key) ||
    `hsl(${colors.border?.hsl || "214.3 31.8% 91.4%"})`;

  const isActive = theme.status === "show";
  const name = showingTranslateValue(theme.name) || "Untitled Theme";
  const description =
    showingTranslateValue(theme.description) || "No description";

  return (
    <Card className="group relative overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:border-muted-foreground/30">
      {/* Theme Preview Area */}
      <div className="relative h-44 overflow-hidden">
        {/* Mini Layout Preview */}
        <div
          className="absolute inset-0 flex"
          style={{ backgroundColor: bgHex }}
        >
          {/* Sidebar mock */}
          <div
            className="w-12 flex-shrink-0 flex flex-col items-center py-3 gap-1.5"
            style={{ backgroundColor: fgHex }}
          >
            <div
              className="w-6 h-6 rounded-md opacity-80"
              style={{ backgroundColor: primaryHex }}
            />
            <div className="w-6 h-1.5 rounded-full bg-white/15 mt-1" />
            <div className="w-6 h-1.5 rounded-full bg-white/15" />
            <div
              className="w-6 h-1.5 rounded-full"
              style={{ backgroundColor: primaryHex, opacity: 0.7 }}
            />
            <div className="w-6 h-1.5 rounded-full bg-white/15" />
            <div className="w-6 h-1.5 rounded-full bg-white/15" />
          </div>
          {/* Main area */}
          <div className="flex-1 flex flex-col">
            {/* Header mock */}
            <div
              className="h-8 flex-shrink-0 px-3 flex items-center gap-2"
              style={{ borderBottom: `1px solid ${borderHex}` }}
            >
              <div
                className="w-14 h-2 rounded-full"
                style={{ backgroundColor: mutedHex }}
              />
              <div className="flex-1" />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: mutedHex }}
              />
            </div>
            {/* Content mock */}
            <div className="flex-1 p-3 space-y-2">
              <div className="flex gap-2">
                <div
                  className="h-6 px-3 rounded-md flex items-center"
                  style={{ backgroundColor: primaryHex }}
                >
                  <div className="w-8 h-1.5 rounded-full bg-white/80" />
                </div>
                <div
                  className="h-6 px-3 rounded-md flex items-center"
                  style={{
                    backgroundColor: secondaryHex,
                    border: `1px solid ${borderHex}`,
                  }}
                >
                  <div
                    className="w-8 h-1.5 rounded-full opacity-50"
                    style={{ backgroundColor: fgHex }}
                  />
                </div>
                <div
                  className="h-6 px-3 rounded-md flex items-center"
                  style={{ backgroundColor: destructiveHex }}
                >
                  <div className="w-6 h-1.5 rounded-full bg-white/80" />
                </div>
              </div>
              <div
                className="rounded-md p-2 space-y-1.5"
                style={{
                  backgroundColor:
                    getHexFromKey(colors.card?.key) ||
                    `hsl(${colors.card?.hsl || "0 0% 100%"})`,
                  border: `1px solid ${borderHex}`,
                }}
              >
                <div
                  className="w-full h-2 rounded-full opacity-30"
                  style={{ backgroundColor: fgHex }}
                />
                <div
                  className="w-3/4 h-2 rounded-full opacity-20"
                  style={{ backgroundColor: fgHex }}
                />
                <div
                  className="w-1/2 h-2 rounded-full"
                  style={{ backgroundColor: accentHex }}
                />
              </div>
              <div className="flex gap-1.5">
                <div
                  className="flex-1 h-8 rounded-md"
                  style={{
                    backgroundColor:
                      getHexFromKey(colors.card?.key) ||
                      `hsl(${colors.card?.hsl || "0 0% 100%"})`,
                    border: `1px solid ${borderHex}`,
                  }}
                />
                <div
                  className="flex-1 h-8 rounded-md"
                  style={{
                    backgroundColor:
                      getHexFromKey(colors.card?.key) ||
                      `hsl(${colors.card?.hsl || "0 0% 100%"})`,
                    border: `1px solid ${borderHex}`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-foreground hover:bg-white shadow-lg"
              onClick={() => onEdit(theme._id)}
            >
              <FiEdit2 className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </div>

        {/* Status + Default badges overlaid on preview */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {theme.isDefault && (
            <Badge className="bg-amber-500/90 text-white border-0 backdrop-blur-sm shadow-sm text-[10px] py-0">
              <FiStar className="w-2.5 h-2.5 mr-0.5 fill-current" />
              Default
            </Badge>
          )}
          {isActive ? (
            <Badge className="bg-primary/90 text-white border-0 backdrop-blur-sm shadow-sm text-[10px] py-0">
              Active
            </Badge>
          ) : (
            <Badge className="bg-gray-500/90 text-white border-0 backdrop-blur-sm shadow-sm text-[10px] py-0">
              Hidden
            </Badge>
          )}
        </div>

        {/* Dropdown menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm"
              >
                <FiMoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={() => onEdit(theme._id)}>
                <FiEdit2 className="w-3.5 h-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(theme._id, theme.status)}
              >
                {isActive ? (
                  <>
                    <FiEyeOff className="w-3.5 h-3.5 mr-2" />
                    Hide
                  </>
                ) : (
                  <>
                    <FiEye className="w-3.5 h-3.5 mr-2" />
                    Show
                  </>
                )}
              </DropdownMenuItem>
              {!theme.isDefault && (
                <DropdownMenuItem onClick={() => onSetDefault(theme._id)}>
                  <FiStar className="w-3.5 h-3.5 mr-2" />
                  Set Default
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(theme._id, name)}
              >
                <FiTrash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card Info */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {description}
            </p>
          </div>
        </div>

        {/* Color palette dots */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex -space-x-1">
            {[
              colors.primary,
              colors.secondary,
              colors.accent,
              colors.destructive,
              colors.muted,
            ]
              .filter(Boolean)
              .map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border-2 border-background shadow-sm"
                  style={{
                    backgroundColor:
                      getHexFromKey(color.key) || `hsl(${color.hsl})`,
                  }}
                  title={color.key}
                />
              ))}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono truncate">
            {theme.typography?.fontFamily?.split(",")[0] || "Inter"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────
const Themes = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setIsUpdate } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  const { open, setOpen, selectedId, selectedIds, toggleDrawer } = useAction();

  const { title, handleUpdate, handleModalOpen, handleDeleteMany } =
    useToggleDrawer();

  const {
    data: themes,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["themes"],
    queryFn: ThemeServices.getAllThemes,
    staleTime: 5 * 60 * 1000,
  });

  const handleSetDefault = useCallback(
    async (id) => {
      try {
        const res = await ThemeServices.setDefaultTheme(id);
        notifySuccess(res.message);
        queryClient.invalidateQueries({ queryKey: ["themes"] });
        queryClient.invalidateQueries({ queryKey: ["themes-show"] });
        queryClient.invalidateQueries({ queryKey: ["active-theme-default"] });
        setIsUpdate(true);
        // Notify DynamicTheme to re-fetch immediately
        window.dispatchEvent(new Event("theme-changed"));
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      }
    },
    [queryClient, setIsUpdate],
  );

  const handleToggleStatus = useCallback(
    async (id, currentStatus) => {
      try {
        const newStatus = currentStatus === "show" ? "hide" : "show";
        const res = await ThemeServices.updateThemeStatus(id, {
          status: newStatus,
        });
        notifySuccess(res.message);
        queryClient.invalidateQueries({ queryKey: ["themes"] });
        queryClient.invalidateQueries({ queryKey: ["themes-show"] });
        queryClient.invalidateQueries({ queryKey: ["active-theme-default"] });
        setIsUpdate(true);
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      }
    },
    [queryClient, setIsUpdate],
  );

  const [isImporting, setIsImporting] = useState(false);

  const handleSeedDemoThemes = useCallback(async () => {
    try {
      setIsImporting(true);
      const res = await ThemeServices.seedDemoThemes();
      notifySuccess(res.message);
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["themes-show"] });
      queryClient.invalidateQueries({ queryKey: ["active-theme-default"] });
      setIsUpdate(true);
      window.dispatchEvent(new Event("theme-changed"));
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setIsImporting(false);
    }
  }, [queryClient, setIsUpdate]);

  // ─── Table Columns (for list view) ─────────────────────────────────
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border border-border flex-shrink-0 shadow-sm"
              style={{
                backgroundColor:
                  getHexFromKey(row.original.colors?.primary?.key) ||
                  `hsl(${row.original.colors?.primary?.hsl || "160.1 84.1% 39.4%"})`,
              }}
            />
            <div>
              <p className="font-medium text-sm text-foreground">
                {showingTranslateValue(row.original.name)}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {showingTranslateValue(row.original.description) ||
                  "No description"}
              </p>
            </div>
          </div>
        ),
        enableSorting: true,
        filterFn: "includesString",
      },
      {
        accessorKey: "colors",
        header: "Color Palette",
        cell: ({ row }) => {
          const c = row.original.colors;
          const palette = [
            c?.primary,
            c?.secondary,
            c?.accent,
            c?.destructive,
            c?.muted,
          ].filter(Boolean);
          return (
            <div className="flex -space-x-1">
              {palette.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border-2 border-background"
                  style={{
                    backgroundColor:
                      getHexFromKey(color.key) || `hsl(${color.hsl})`,
                  }}
                  title={color.key}
                />
              ))}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "typography.fontFamily",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Font" />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-mono">
            {row.original.typography?.fontFamily?.split(",")[0] || "Inter"}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const isActive = row.original.status === "show";
          return (
            <button
              onClick={() =>
                handleToggleStatus(row.original._id, row.original.status)
              }
              className="cursor-pointer"
            >
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/20 "
                    : "bg-muted text-muted-foreground hover:bg-muted/80 "
                }
              >
                {isActive ? (
                  <FiEye className="w-3 h-3 mr-1" />
                ) : (
                  <FiEyeOff className="w-3 h-3 mr-1" />
                )}
                {isActive ? "Active" : "Hidden"}
              </Badge>
            </button>
          );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        enableSorting: true,
      },
      {
        accessorKey: "isDefault",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Default" />
        ),
        cell: ({ row }) =>
          row.original.isDefault ? (
            <Badge className="bg-amber-100 text-amber-700">
              <FiStar className="w-3 h-3 mr-1 fill-current" />
              Default
            </Badge>
          ) : (
            <button
              onClick={() => handleSetDefault(row.original._id)}
              className="text-xs text-muted-foreground hover:text-amber-600 transition-colors cursor-pointer"
            >
              Set Default
            </button>
          ),
        enableSorting: true,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DynamicTableRowActions
            row={row}
            actions={[
              {
                key: "edit",
                label: "Edit",
                icon: Pencil,
                onClick: () => handleUpdate(row.original._id),
              },
              { separator: true },
              {
                key: "delete",
                label: "Delete",
                icon: Trash2,
                variant: "delete",
                onClick: () =>
                  handleModalOpen(
                    row.original._id,
                    showingTranslateValue(row.original.name),
                  ),
              },
            ]}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [
      handleToggleStatus,
      handleSetDefault,
      handleUpdate,
      handleModalOpen,
      showingTranslateValue,
    ],
  );

  // Client-side search filter
  const filteredData = useMemo(() => {
    if (!themes || !searchText) return themes || [];
    const search = searchText.toLowerCase();
    return themes.filter(
      (t) =>
        showingTranslateValue(t.name)?.toLowerCase().includes(search) ||
        showingTranslateValue(t.description)?.toLowerCase().includes(search),
    );
  }, [themes, searchText, showingTranslateValue]);

  const statusFilter = {
    column: "status",
    title: "Status",
    options: [
      { label: "Active", value: "show" },
      { label: "Hidden", value: "hide" },
    ],
  };

  return (
    <>
      <div className="flex items-center justify-between py-4 lg:py-8">
        <SectionTitle title="Themes" description={t("ThemesPageDesc")} />
        <ButtonGroup>
          <Button
            disabled={selectedIds.length < 1}
            onClick={() =>
              handleDeleteMany(
                selectedIds,
                t("Selected") + " " + t("ThemesPage"),
              )
            }
            variant="delete"
          >
            <FiTrash2 className="mr-1" />
            {t("Delete")}
          </Button>
          <Button
            onClick={handleSeedDemoThemes}
            variant="outline"
            disabled={isImporting}
          >
            <FiDownload className="mr-1" />
            {isImporting ? "Importing..." : "Import Demo"}
          </Button>
          <Button onClick={toggleDrawer} variant="create">
            <FiPlus className="mr-1" />
            Add Theme
          </Button>
        </ButtonGroup>
      </div>

      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />

      <MainDrawer>
        <ThemeDrawer id={selectedId} />
      </MainDrawer>

      <AnimatedContent>
        {/* Search + View Toggle Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search themes..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 bg-muted">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "ghost"}
              className="h-7 w-7 p-0"
              onClick={() => setViewMode("grid")}
            >
              <FiGrid className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              className="h-7 w-7 p-0"
              onClick={() => setViewMode("list")}
            >
              <FiList className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" ? (
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-44 animate-pulse bg-muted" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="flex gap-1 pt-1">
                      {[...Array(5)].map((_, j) => (
                        <div
                          key={j}
                          className="w-5 h-5 rounded-full animate-pulse bg-muted"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredData?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredData.map((theme) => (
                <ThemeCard
                  key={theme._id}
                  theme={theme}
                  onEdit={handleUpdate}
                  onDelete={handleModalOpen}
                  onSetDefault={handleSetDefault}
                  onToggleStatus={handleToggleStatus}
                  showingTranslateValue={showingTranslateValue}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FiGrid className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                No themes found
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchText
                  ? "Try a different search term"
                  : "Create your first theme to get started"}
              </p>
              {!searchText && (
                <Button
                  onClick={toggleDrawer}
                  variant="create"
                  className="mt-4"
                >
                  <FiPlus className="mr-1" />
                  Add Theme
                </Button>
              )}
            </div>
          )
        ) : (
          /* List / Table View */
          <DynamicTable
            data={filteredData}
            columns={columns}
            loading={loading}
            queryKey="themes"
            searchText={searchText}
            onSearchChange={setSearchText}
            searchColumns={["name"]}
            filters={[statusFilter]}
            header={false}
            totalCount={filteredData?.length || 0}
            totalPages={1}
            currentPage={1}
            pageSize={filteredData?.length || 10}
          />
        )}
      </AnimatedContent>
    </>
  );
};

export default Themes;
