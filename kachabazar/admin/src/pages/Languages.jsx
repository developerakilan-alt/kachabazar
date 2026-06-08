import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

//internal import
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import LanguageServices from "@/services/LanguageServices";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import LanguageDrawer from "@/components/drawer/LanguageDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useAction } from "@/context/ActionContext";
import ShowHideButton from "@/components/table/ShowHideButton";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { selectColumn } from "@/components/table/selectColumn";

const Languages = () => {
  const {
    open,
    setOpen,
    selectedId,
    selectedIds,
    setSelectedIds,
    toggleDrawer,
  } = useAction();

  // Local table state (per-page)
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const {
    title,
    handleDeleteMany,
    handleUpdateMany,
    handleUpdate,
    handleModalOpen,
  } = useToggleDrawer();
  const { t } = useTranslation();

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Derive sort params from table sorting state
  const sortBy = sorting[0]?.id || "";
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : "";

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: [
      "languages",
      currentPage,
      pageSize,
      searchText,
      statusFilter,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      LanguageServices.getAllLanguages({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        status: statusFilter || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const languages = data?.languages || [];
  const totalDoc = data?.totalDoc || 0;

  const handleResetFilters = useCallback(() => {
    setSearchText("");
    setStatusFilter("");
    setCurrentPage(1);
  }, []);

  // ─── Table Columns ──────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      selectColumn,
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("LanguagesNname")}
          />
        ),
        cell: ({ row }) => <span className="text-sm">{row.original.name}</span>,
        enableSorting: true,
      },
      {
        accessorKey: "code",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("LanguagesIsoCode")}
          />
        ),
        cell: ({ row }) => <span className="text-sm">{row.original.code}</span>,
        enableSorting: true,
      },
      {
        accessorKey: "flag",
        header: t("LanguagesFlag"),
        cell: ({ row }) => <span>{row.original?.flag}</span>,
        enableSorting: false,
      },
      {
        id: "published",
        header: () => (
          <span className="text-center block">{t("LanguagesPublished")}</span>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <ShowHideButton
              id={row.original._id}
              status={row.original.status}
            />
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "actions",
        header: () => (
          <span className="text-right block">{t("LanguagesActions")}</span>
        ),
        cell: ({ row }) => (
          <DynamicTableRowActions
            row={row}
            actions={[
              {
                key: "edit",
                label: t("Edit"),
                icon: Pencil,
                onClick: () => handleUpdate(row.original._id),
              },
              { separator: true },
              {
                key: "delete",
                label: t("Delete"),
                icon: Trash2,
                variant: "delete",
                onClick: () =>
                  handleModalOpen(row.original._id, row.original.name),
              },
            ]}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [t, handleUpdate, handleModalOpen],
  );

  return (
    <>
      <div className="flex items-center justify-between py-4 lg:py-8">
        <SectionTitle
          title={t("SidebarLanguages")}
          description={t("LanguagesPageDesc")}
        />
        <ButtonGroup>
          <Button
            disabled={selectedIds.length < 1}
            onClick={() => handleUpdateMany(selectedIds)}
            variant="bulkAction"
          >
            <FiEdit className="mr-1" />
            {t("BulkAction")}
          </Button>
          <Button
            disabled={selectedIds.length < 1}
            onClick={() =>
              handleDeleteMany(
                selectedIds,
                t("Selected") + " " + t("Languages"),
              )
            }
            variant="delete"
          >
            <FiTrash2 className="mr-1" />
            {t("Delete")}
          </Button>
          <Button onClick={toggleDrawer} variant="create">
            <FiPlus className="mr-1" />
            Add language
          </Button>
        </ButtonGroup>
      </div>

      <MainDrawer>
        <LanguageDrawer id={selectedId} />
      </MainDrawer>

      <BulkActionDrawer ids={selectedIds} title="Languages" />
      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />

      <AnimatedContent>
        <DynamicTable
          data={languages}
          columns={columns}
          loading={loading}
          serverSide
          searchText={searchText}
          onSearchChange={(v) => {
            setSearchText(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search by name or code..."
          filters={[
            {
              title: "Published",
              options: [
                { label: "Published", value: "show" },
                { label: "Unpublished", value: "hide" },
              ],
              value: statusFilter,
              onChange: (v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              },
            },
          ]}
          onReset={handleResetFilters}
          sorting={sorting}
          setSorting={setSorting}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          setSelectedIds={setSelectedIds}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          totalCount={totalDoc}
          totalPages={Math.ceil(totalDoc / pageSize) || 1}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </AnimatedContent>
    </>
  );
};

export default Languages;
