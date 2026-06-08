import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { Pencil, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

//internal import
import UploadMany from "@/components/common/UploadMany";
import CouponServices from "@/services/CouponServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import CouponDrawer from "@/components/drawer/CouponDrawer";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useAction } from "@/context/ActionContext";
import useFilter from "@/hooks/useFilter";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import ShowHideButton from "@/components/table/ShowHideButton";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { selectColumn } from "@/components/table/selectColumn";

const Coupons = () => {
  const { t } = useTranslation();
  const {
    open,
    setOpen,
    selectedId,
    selectedIds,
    setSelectedIds,
    isCheckAll,
    toggleDrawer,
    handleSelectAll,
  } = useAction();

  // Local table state (per-page to avoid cross-page interference)
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [couponStatus, setCouponStatus] = useState("");

  // Derive sort params from table sorting state
  const sortBy = sorting[0]?.id || "";
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : "";

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: [
      "coupons",
      currentPage,
      pageSize,
      searchText,
      statusFilter,
      couponStatus,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      CouponServices.getAllCoupons({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        status: statusFilter || undefined,
        couponStatus: couponStatus || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // Stable reference to avoid useFilter infinite loop
  const coupons = useMemo(() => data?.coupons || [], [data?.coupons]);
  const totalDoc = data?.totalDoc || 0;

  const {
    title,
    handleDeleteMany,
    handleUpdateMany,
    handleUpdate,
    handleModalOpen,
  } = useToggleDrawer();
  const { currency, formatPrice, showDateFormat, showingTranslateValue } =
    useUtilsFunction();

  const {
    filename,
    isDisabled,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(coupons);

  const handleResetFilters = useCallback(() => {
    setSearchText("");
    setStatusFilter("");
    setCouponStatus("");
    setCurrentPage(1);
  }, []);

  // ─── Table Columns ──────────────────────────────────────────────────

  const columns = useMemo(
    () => [
      selectColumn,
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("CoupTblCampaignsName")}
          />
        ),
        cell: ({ row }) => {
          const coupon = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="hidden md:block bg-muted p-1 shadow-none h-8 w-8">
                <AvatarImage
                  src={
                    coupon?.logo ||
                    "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                  }
                  alt="coupon"
                />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <span className="text-sm">
                {showingTranslateValue(coupon?.title)}
              </span>
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "couponCode",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("CoupTblCode")} />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.couponCode}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "discount",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("Discount")} />
        ),
        cell: ({ row }) => {
          const coupon = row.original;
          return (
            <span className="text-sm font-semibold">
              {coupon?.discountType?.type === "percentage"
                ? `${coupon?.discountType?.value}%`
                : coupon?.discountType?.value
                  ? formatPrice(coupon?.discountType?.value)
                  : ""}
            </span>
          );
        },
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
        accessorKey: "startTime",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("CoupTblStartDate")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            {showDateFormat(row.original.startTime)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "endTime",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("CoupTblEndDate")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            {showDateFormat(row.original.endTime)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "couponStatus",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("CoupTblStatus")}
          />
        ),
        cell: ({ row }) =>
          dayjs().isAfter(dayjs(row.original.endTime)) ? (
            <Badge variant="error">Expired</Badge>
          ) : (
            <Badge variant="success">Active</Badge>
          ),
        enableSorting: false,
      },
      {
        id: "actions",
        header: () => (
          <span className="text-right block">{t("CoupTblActions")}</span>
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
                  handleModalOpen(
                    row.original._id,
                    showingTranslateValue(row.original?.title),
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
      t,
      currency,
      showDateFormat,
      showingTranslateValue,
      handleUpdate,
      handleModalOpen,
    ],
  );

  return (
    <>
      <div className="flex items-center justify-between py-4 lg:py-8">
        <SectionTitle
          title={t("CouponspageTitle")}
          description={t("CouponsPageDesc")}
        />
        <ButtonGroup>
          <UploadMany
            title="Coupon"
            exportData={coupons}
            filename={filename}
            isDisabled={isDisabled}
            handleSelectFile={handleSelectFile}
            handleUploadMultiple={handleUploadMultiple}
            handleRemoveSelectFile={handleRemoveSelectFile}
          />
          <Button
            variant="bulkAction"
            disabled={selectedIds?.length < 1}
            onClick={() => handleUpdateMany(selectedIds)}
          >
            <FiEdit className="mr-1" />
            {t("BulkAction")}
          </Button>
          <Button
            variant="delete"
            disabled={selectedIds?.length < 1}
            onClick={() =>
              handleDeleteMany(selectedIds, t("Selected") + " " + t("Coupons"))
            }
          >
            <FiTrash2 className="mr-1" />
            {t("Delete")}
          </Button>
          <Button variant="create" onClick={toggleDrawer}>
            <FiPlus className="mr-1" />
            {t("AddCouponsBtn")}
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
      <BulkActionDrawer ids={selectedIds} title="Coupons" />

      <MainDrawer>
        <CouponDrawer id={selectedId} />
      </MainDrawer>

      <AnimatedContent>
        <DynamicTable
          data={coupons}
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
            {
              title: "Status",
              options: [
                { label: "Active", value: "active" },
                { label: "Expired", value: "expired" },
              ],
              value: couponStatus,
              onChange: (v) => {
                setCouponStatus(v);
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

export default Coupons;
