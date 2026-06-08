import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

//internal import
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import CurrencyDrawer from "@/components/drawer/CurrencyDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import CurrencyServices from "@/services/CurrencyServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useAction } from "@/context/ActionContext";
import ShowHideButton from "@/components/table/ShowHideButton";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { selectColumn } from "@/components/table/selectColumn";

const Currencies = () => {
  const { t } = useTranslation();
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
      "currencies",
      currentPage,
      pageSize,
      searchText,
      statusFilter,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      CurrencyServices.getAllCurrency({
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

  const currencies = data?.currencies || [];
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
            title={t("CurrenciesName")}
          />
        ),
        cell: ({ row }) => <span className="text-sm">{row.original.name}</span>,
        enableSorting: true,
      },
      {
        accessorKey: "symbol",
        header: () => (
          <span className="text-center block">{t("CurrenciesSymbol")}</span>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-center block">
            {row.original.symbol}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: "enabled",
        header: () => (
          <span className="text-center block">{t("CurrenciesEnabled")}</span>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <ShowHideButton
              id={row.original._id}
              status={row.original.status}
              currencyStatusName={row.original.name}
            />
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "actions",
        header: () => (
          <span className="text-right block">{t("CurrenciesActions")}</span>
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
          title="Currencies"
          description={t("CurrenciesPageDesc")}
        />
        <ButtonGroup>
          <Button
            disabled={selectedIds.length < 1}
            onClick={() => handleUpdateMany(selectedIds)}
            variant="bulkAction"
          >
            <FiEdit className="mr-1" />
            Bulk Action
          </Button>
          <Button
            disabled={selectedIds.length < 1}
            onClick={() =>
              handleDeleteMany(
                selectedIds,
                t("Selected") + " " + t("Currencies"),
              )
            }
            variant="delete"
          >
            <FiTrash2 className="mr-1" />
            {t("Delete")}
          </Button>
          <Button onClick={toggleDrawer} variant="create">
            <FiPlus className="mr-1" />
            Add Currency
          </Button>
        </ButtonGroup>
      </div>

      <BulkActionDrawer ids={selectedIds} title="Currencies" />
      <MainDrawer>
        <CurrencyDrawer id={selectedId} />
      </MainDrawer>
      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />

      <AnimatedContent>
        <DynamicTable
          data={currencies}
          columns={columns}
          loading={loading}
          serverSide
          searchText={searchText}
          onSearchChange={(v) => {
            setSearchText(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search by name, symbol, or ISO code..."
          filters={[
            {
              title: "Enabled",
              options: [
                { label: "Enabled", value: "show" },
                { label: "Disabled", value: "hide" },
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

export default Currencies;
