import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

//internal import
import useToggleDrawer from "@/hooks/useToggleDrawer";
import UploadMany from "@/components/common/UploadMany";
import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import AttributeServices from "@/services/AttributeServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import AttributeDrawer from "@/components/drawer/AttributeDrawer";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import Tooltip from "@/components/tooltip/Tooltip";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import ShowHideButton from "@/components/table/ShowHideButton";
import useFilter from "@/hooks/useFilter";
import { useAction } from "@/context/ActionContext";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { selectColumn } from "@/components/table/selectColumn";

const Attributes = () => {
  const { t } = useTranslation();
  const { showingTranslateValue } = useUtilsFunction();
  const {
    open,
    setOpen,
    selectedId,
    selectedIds,
    setSelectedIds,
    toggleDrawer,
  } = useAction();

  // Local table state (per-page to avoid cross-page interference)
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
  const [optionFilter, setOptionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Derive sort params from table sorting state
  const sortBy = sorting[0]?.id || "";
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : "";

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: [
      "attributes",
      currentPage,
      pageSize,
      searchText,
      optionFilter,
      statusFilter,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      AttributeServices.getAllAttributes({
        type: "attribute",
        option: optionFilter || undefined,
        option1: undefined,
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

  // Stable reference to avoid useFilter infinite loop
  const attributes = useMemo(() => data?.attributes || [], [data?.attributes]);
  const totalDoc = data?.totalDoc || 0;

  const {
    filename,
    isDisabled,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(attributes);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchText("");
    setOptionFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  }, []);

  // ─── Table Columns ──────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      selectColumn,
      {
        accessorKey: "_id",
        header: () => <span>{t("Id")}</span>,
        cell: ({ row }) => (
          <span className="font-semibold uppercase text-xs">
            {row.original._id?.substring(20, 24)}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("AName")} />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-sm">
            {showingTranslateValue(row.original.title)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("ADisplayName")} />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-sm">
            {showingTranslateValue(row.original.name)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "option",
        header: () => <span>{t("AOption")}</span>,
        cell: ({ row }) => (
          <span className="font-medium text-sm">{row.original.option}</span>
        ),
        enableSorting: false,
      },
      {
        id: "published",
        header: () => (
          <span className="text-center block">{t("catPublishedTbl")}</span>
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
        id: "editValues",
        header: () => <span className="text-center block">{t("Avalues")}</span>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Link
              to={`/attributes/${row.original._id}`}
              className="p-2 cursor-pointer text-muted-foreground hover:text-primary focus:outline-none"
            >
              <Tooltip
                id="edit values"
                Icon={FiEdit}
                title="Edit Values"
                bgColor="#10B981"
              />
            </Link>
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "actions",
        header: () => <span className="text-right block">{t("AAction")}</span>,
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
                  handleModalOpen(
                    row.original._id,
                    showingTranslateValue(row.original.title),
                  ),
              },
            ]}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [t, showingTranslateValue, handleUpdate, handleModalOpen],
  );

  return (
    <>
      <div className="flex items-center justify-between py-4 lg:py-8">
        <SectionTitle
          title={t("AttributeTitle")}
          description={t("AttributesPageDesc")}
        />
        <ButtonGroup>
          <UploadMany
            title="Attribute"
            exportData={attributes}
            totalDoc={totalDoc}
            filename={filename}
            isDisabled={isDisabled}
            handleSelectFile={handleSelectFile}
            handleUploadMultiple={handleUploadMultiple}
            handleRemoveSelectFile={handleRemoveSelectFile}
          />
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
                t("Selected") + " " + t("Attributes"),
              )
            }
            variant="delete"
          >
            <FiTrash2 className="mr-1" />
            {t("Delete")}
          </Button>
          <Button onClick={toggleDrawer} variant="create">
            <FiPlus className="mr-1" />
            {t("CouponsAddAttributeBtn")}
          </Button>
        </ButtonGroup>
      </div>

      <BulkActionDrawer ids={selectedIds} title="Attributes" />
      <MainDrawer>
        <AttributeDrawer id={selectedId} />
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
          data={attributes}
          columns={columns}
          loading={loading}
          serverSide
          searchText={searchText}
          onSearchChange={(v) => {
            setSearchText(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search by name..."
          filters={[
            {
              title: "Option Type",
              options: [
                { label: "Dropdown", value: "dropdown" },
                { label: "Radio", value: "radio" },
                { label: "Checkbox", value: "checkbox" },
              ],
              value: optionFilter,
              onChange: (v) => {
                setOptionFilter(v);
                setCurrentPage(1);
              },
            },
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

export default Attributes;
