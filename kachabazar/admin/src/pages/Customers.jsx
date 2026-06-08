import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FiZoomIn } from "react-icons/fi";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

//internal import
import useFilter from "@/hooks/useFilter";
import useDisableForDemo from "@/hooks/useDisableForDemo";
import UploadMany from "@/components/common/UploadMany";
import CustomerServices from "@/services/CustomerServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import { useAction } from "@/context/ActionContext";
import CustomerDrawer from "@/components/drawer/CustomerDrawer";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { selectColumn } from "@/components/table/selectColumn";

const Customers = () => {
  const { open, setOpen, selectedId, selectedIds, setSelectedIds } =
    useAction();

  // Local table state (per-page to avoid cross-page interference)
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const { title, handleUpdate, handleModalOpen, handleDeleteMany } =
    useToggleDrawer();
  const { t } = useTranslation();
  const { handleDisableForDemo } = useDisableForDemo();

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState("");

  // Derive sort params from table sorting state
  const sortBy = sorting[0]?.id || "";
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : "";

  const {
    data,
    error,
    isFetched,
    isLoading: loading,
  } = useQuery({
    queryKey: [
      "customers",
      currentPage,
      pageSize,
      searchText,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      CustomerServices.getAllCustomers({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // Stable reference to avoid useFilter infinite loop
  const customers = useMemo(() => data?.customers || [], [data?.customers]);
  const totalDoc = data?.totalDoc || 0;

  const {
    filename,
    isDisabled,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(customers);

  // ─── Table Columns ──────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      selectColumn,
      {
        accessorKey: "_id",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("CustomersId")} />
        ),
        cell: ({ row }) => (
          <span className="font-semibold uppercase text-xs">
            {row.original?._id?.substring(20, 24)}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("CustomersJoiningDate")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            {dayjs(row.original.createdAt).format("MMM D, YYYY")}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("CustomersName")}
          />
        ),
        cell: ({ row }) => <span className="text-sm">{row.original.name}</span>,
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("CustomersEmail")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.email}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("CustomersPhone")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm font-medium">{row.original.phone}</span>
        ),
        enableSorting: false,
      },
      {
        id: "actions",
        header: () => (
          <span className="text-right block">{t("CustomersActions")}</span>
        ),
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Link
              to={`/customer-order/${row.original._id}`}
              className="p-2 cursor-pointer text-muted-foreground hover:text-primary"
            >
              <FiZoomIn className="w-4 h-4" />
            </Link>
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
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [t, handleUpdate, handleModalOpen],
  );

  return (
    <>
      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />

      <MainDrawer>
        <CustomerDrawer id={selectedId} data={customers} />
      </MainDrawer>

      <div className="flex items-center justify-between py-4 lg:py-8">
        <SectionTitle
          title={t("CustomersPage")}
          description={t("CustomersPageDesc")}
        />
        <ButtonGroup>
          <Button
            variant="delete"
            disabled={selectedIds?.length < 1}
            onClick={() => {
              if (handleDisableForDemo()) return;
              handleDeleteMany(
                selectedIds,
                t("Selected") + " " + t("Customers"),
              );
            }}
            className="space-x-1"
          >
            <FiTrash2 size={18} />
            <span>{t("Delete")}</span>
          </Button>
          <UploadMany
            title="Customers"
            exportData={customers}
            filename={filename}
            isDisabled={isDisabled}
            handleSelectFile={handleSelectFile}
            handleUploadMultiple={handleUploadMultiple}
            handleRemoveSelectFile={handleRemoveSelectFile}
          />
        </ButtonGroup>
      </div>

      <AnimatedContent>
        <DynamicTable
          data={customers}
          columns={columns}
          loading={loading}
          serverSide
          searchText={searchText}
          onSearchChange={(v) => {
            setSearchText(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search by name, email, or phone..."
          filters={[]}
          onReset={() => {
            setSearchText("");
            setSorting([]);
            setCurrentPage(1);
          }}
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
          totalPages={Math.ceil(totalDoc / pageSize)}
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

export default Customers;
