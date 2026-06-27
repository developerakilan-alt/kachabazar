import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo, useCallback } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { FiZoomIn, FiTrash2 } from "react-icons/fi";
import { Send, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import exportFromJSON from "export-from-json";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

//internal import
import { notifyError, notifySuccess } from "@/utils/toast";
import OrderServices from "@/services/OrderServices";
import ShiprocketServices from "@/services/ShiprocketServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import AnimatedContent from "@/components/common/AnimatedContent";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import Status from "@/components/table/Status";
import SelectStatus from "@/components/form/selectOption/SelectStatus";
import PrintReceipt from "@/components/form/others/PrintReceipt";
import { SectionTitle } from "@/components/common/SectionTitle";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { selectColumn } from "@/components/table/selectColumn";
import { useAction } from "@/context/ActionContext";
import DeleteModal from "@/components/modal/DeleteModal";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useDisableForDemo from "@/hooks/useDisableForDemo";

const Orders = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingBulkUpdate, setLoadingBulkUpdate] = useState(false);
  const [pushingShiprocket, setPushingShiprocket] = useState({});
  const [refreshingShiprocket, setRefreshingShiprocket] = useState({});
  const [bulkPushing, setBulkPushing] = useState(false);
  const { open, setOpen, selectedId, selectedIds, setSelectedIds } =
    useAction();
  const { title, handleModalOpen, handleDeleteMany } = useToggleDrawer();
  const { handleDisableForDemo } = useDisableForDemo();

  // Local table state (per-page to avoid cross-page interference)
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Server-side filter state — all local, no SidebarContext
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [time, setTime] = useState("");
  const [method, setMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: [
      "allOrders",
      currentPage,
      pageSize,
      searchText,
      status,
      time,
      method,
      startDate,
      endDate,
    ],
    queryFn: () =>
      OrderServices.getAllOrders({
        page: currentPage,
        limit: pageSize,
        customerName: searchText || "",
        status: status || "",
        day: time || "",
        method: method || "",
        startDate: startDate || "",
        endDate: endDate || "",
      }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const { currency, formatPrice, getNumber, getNumberTwo, showDateTimeFormat } =
    useUtilsFunction();

  const handleDownloadOrders = async () => {
    try {
      setLoadingExport(true);
      const res = await OrderServices.getAllOrders({
        page: 1,
        day: time || "",
        method: method || "",
        status: status || "",
        endDate: endDate || "",
        download: true,
        startDate: startDate || "",
        limit: data?.totalDoc || 100,
        customerName: searchText || "",
      });
      const exportData = res?.orders?.map((order) => ({
        _id: order._id,
        invoice: order.invoice,
        subTotal: getNumberTwo(order.subTotal),
        shippingCost: getNumberTwo(order.shippingCost),
        discount: getNumberTwo(order?.discount),
        total: getNumberTwo(order.total),
        paymentMethod: order.paymentMethod,
        status: order.status,
        user_info: order?.user_info?.name,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }));
      exportFromJSON({
        data: exportData,
        fileName: "orders",
        exportType: exportFromJSON.types.csv,
      });
      setLoadingExport(false);
    } catch (err) {
      setLoadingExport(false);
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  const handleResetFilters = useCallback(() => {
    setSearchText("");
    setStatus("");
    setTime("");
    setMethod("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  }, []);

  const handleBulkStatusUpdate = async (newStatus) => {
    if (handleDisableForDemo()) return;
    if (!selectedIds?.length || !newStatus) return;
    try {
      setLoadingBulkUpdate(true);
      const res = await OrderServices.updateManyOrders({
        ids: selectedIds,
        status: newStatus,
      });
      notifySuccess(res?.message || `${selectedIds.length} orders updated!`);
      queryClient.invalidateQueries(["allOrders"]);
      setSelectedIds([]);
      setRowSelection({});
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setLoadingBulkUpdate(false);
    }
  };

  // Refresh Shiprocket status
  const handleRefreshShiprocket = useCallback(
    async (orderId) => {
      if (handleDisableForDemo()) return;
      try {
        setRefreshingShiprocket((prev) => ({ ...prev, [orderId]: true }));
        const res = await ShiprocketServices.refreshStatus(orderId);
        const srLabel = (res?.tracking?.status || "updated")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        notifySuccess(
          `ShipRocket: ${srLabel} | Order: ${res?.orderStatus || "—"}`,
        );
        queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      } finally {
        setRefreshingShiprocket((prev) => ({ ...prev, [orderId]: false }));
      }
    },
    [handleDisableForDemo, queryClient],
  );

  // Push order to Shiprocket
  const handlePushToShiprocket = useCallback(
    async (orderId) => {
      if (handleDisableForDemo()) return;
      try {
        setPushingShiprocket((prev) => ({ ...prev, [orderId]: true }));
        const res = await ShiprocketServices.createOrder(orderId);
        notifySuccess(res?.message || "Order pushed to ShipRocket successfully!");
        queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      } finally {
        setPushingShiprocket((prev) => ({ ...prev, [orderId]: false }));
      }
    },
    [handleDisableForDemo, queryClient],
  );

  // Bulk push to Shiprocket
  const handleBulkPushToShiprocket = useCallback(async () => {
    if (handleDisableForDemo() || !selectedIds?.length) return;
    try {
      setBulkPushing(true);
      let success = 0;
      let failed = 0;
      for (const id of selectedIds) {
        try {
          await ShiprocketServices.createOrder(id);
          success++;
        } catch {
          failed++;
        }
      }
      notifySuccess(
        `Pushed ${success} order(s) to ShipRocket${failed ? `, ${failed} failed` : ""}`,
      );
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      setSelectedIds([]);
      setRowSelection({});
    } catch (err) {
      notifyError(err?.message || "Bulk push failed");
    } finally {
      setBulkPushing(false);
    }
  }, [handleDisableForDemo, selectedIds, queryClient, setSelectedIds]);

  // ─── Table Columns ──────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      selectColumn,
      {
        accessorKey: "invoice",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("InvoiceNo")} />
        ),
        cell: ({ row }) => (
          <span className="font-semibold uppercase text-xs">
            {row.original?.invoice}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "updatedDate",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("TimeTbl")} />
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            {showDateTimeFormat(row.original?.updatedDate)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "customerName",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("CustomerName")} />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original?.user_info?.name}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "paymentMethod",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("MethodTbl")} />
        ),
        cell: ({ row }) => (
          <span className="text-sm font-semibold">
            {row.original?.paymentMethod}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "total",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("AmountTbl")} />
        ),
        cell: ({ row }) => (
          <span className="text-sm font-semibold">
            {formatPrice(row.original?.total)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("OderStatusTbl")}
          />
        ),
        cell: ({ row }) => <Status status={row.original?.status} />,
        enableSorting: true,
      },
      {
        accessorKey: "shiprocket",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Shipping" />
        ),
        cell: ({ row }) => {
          const sr = row.original?.shiprocket;
          const ct = row.original?.courierTracking;
          const orderStatus = row.original?.status?.toLowerCase();
          const isTerminal =
            orderStatus === "delivered" || orderStatus === "cancel";
          const isPushing = pushingShiprocket[row.original._id];

          // Show courier tracking info if set
          if (ct?.url) {
            return (
              <div>
                <span className="block text-xs font-medium">
                  {ct.name || "Courier"}
                </span>
                {ct.trackingNumber && (
                  <span className="block text-[10px] font-mono text-muted-foreground">
                    #{ct.trackingNumber}
                  </span>
                )}
                <a
                  href={ct.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-[10px] text-primary hover:underline font-medium"
                >
                  Track
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            );
          }

          // Show Shiprocket tracking info
          if (sr?.awb || sr?.orderId) {
            const isRefreshing = refreshingShiprocket[row.original._id];
            const srLabel = (sr.status || "created")
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <div className="flex items-center gap-2">
                <div>
                  {sr?.awb ? (
                    <span className="text-xs font-mono font-medium">
                      AWB: {sr.awb}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Pushed to SR
                    </span>
                  )}
                  <span className="block text-[10px] text-muted-foreground">
                    SR: {srLabel}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    Order: <span className="font-medium capitalize">{row.original?.status}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRefreshShiprocket(row.original._id)}
                  disabled={isRefreshing}
                  className="shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full border border-border hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
                  title="Refresh ShipRocket Status"
                >
                  {isRefreshing ? (
                    <span className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                  ) : (
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      className="h-3 w-3 text-muted-foreground"
                    >
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  )}
                </button>
              </div>
            );
          }

          if (isTerminal) {
            return <span className="text-xs text-muted-foreground">—</span>;
          }

          return (
            <button
              type="button"
              onClick={() => handlePushToShiprocket(row.original._id)}
              disabled={isPushing}
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium cursor-pointer disabled:opacity-50"
            >
              {isPushing ? (
                <span className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
              ) : (
                <Send className="h-3 w-3" />
              )}
              {isPushing ? "Pushing..." : "Push"}
            </button>
          );
        },
        enableSorting: false,
      },
      {
        id: "action",
        header: t("ActionTbl"),
        cell: ({ row }) => (
          <SelectStatus id={row.original._id} order={row.original} />
        ),
        enableSorting: false,
      },
      {
        id: "invoice-action",
        header: () => (
          <span className="text-right block">{t("InvoiceTbl")}</span>
        ),
        cell: ({ row }) => (
          <div className="flex justify-end items-center gap-1">
            <PrintReceipt orderId={row.original._id} order={row.original} />
            {/* <Link
              to={`/order/${row.original._id}`}
              className="p-2 cursor-pointer text-muted-foreground hover:text-primary"
            >
              <FiZoomIn className="w-4 h-4" />
            </Link> */}
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [t, currency, showDateTimeFormat, handlePushToShiprocket, pushingShiprocket],
  );

  return (
    <>
      <div className="flex items-center justify-between py-4 lg:py-8">
        <SectionTitle title={t("Orders")} description={t("OrdersPageDesc")} />
        <div className="flex flex-wrap gap-2">
          {/* Bulk Status Update */}
          <Select
            disabled={selectedIds?.length < 1 || loadingBulkUpdate}
            onValueChange={handleBulkStatusUpdate}
          >
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue
                placeholder={
                  loadingBulkUpdate
                    ? t("Processing") + "..."
                    : `${t("BulkAction")} (${selectedIds?.length || 0})`
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Delivered">
                {t("PageOrderDelivered")}
              </SelectItem>
              <SelectItem value="Pending">{t("PageOrderPending")}</SelectItem>
              <SelectItem value="Processing">
                {t("PageOrderProcessing")}
              </SelectItem>
              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
              <SelectItem value="Cancel">{t("OrderCancel")}</SelectItem>
              <SelectItem value="refund-processing">Refund Processing</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk Push to Shiprocket */}
          {/* <Button
            variant="outline"
            disabled={selectedIds?.length < 1 || bulkPushing}
            onClick={handleBulkPushToShiprocket}
            className="space-x-1"
          >
            {bulkPushing ? (
              <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <Send size={16} />
            )}
            <span>
              {bulkPushing
                ? "Pushing..."
                : `Push to ShipRocket (${selectedIds?.length || 0})`}
            </span>
          </Button> */}

          {/* Bulk Delete */}
          <Button
            variant="delete"
            disabled={selectedIds?.length < 1}
            onClick={() => {
              if (handleDisableForDemo()) return;
              handleDeleteMany(selectedIds, t("Selected") + " " + t("Orders"));
            }}
            className="space-x-1"
          >
            <FiTrash2 size={18} />
            <span>{t("Delete")}</span>
          </Button>

          {loadingExport ? (
            <Button disabled type="button">
              <img
                src={spinnerLoadingImage}
                alt="Loading"
                width={20}
                height={10}
              />
              <span className="ml-2">Processing</span>
            </Button>
          ) : (
            <Button
              onClick={handleDownloadOrders}
              disabled={data?.orders?.length <= 0 || loadingExport}
              type="button"
            >
              Download All Orders
              <IoCloudDownloadOutline className="ml-2" />
            </Button>
          )}
        </div>
      </div>

      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />

      <AnimatedContent>
        {/* Date Range Filters */}
        <div className="mb-3 flex flex-wrap gap-4 items-end">
          <div>
            <Label className="text-xs">Start Date</Label>
            <Input
              type="date"
              className="h-8 w-[160px]"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <Label className="text-xs">End Date</Label>
            <Input
              type="date"
              className="h-8 w-[160px]"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {data?.methodTotals?.length > 0 && (
          <div className="flex items-center gap-4 mb-3 px-4 py-2.5 rounded-lg border bg-muted/50">
            {data.methodTotals.map((el, i) => (
              <div key={i + 1} className="flex items-center gap-1 text-sm">
                {el?.method && (
                  <>
                    <span className="font-medium text-muted-foreground">
                      {el.method}:
                    </span>
                    <span className="font-semibold">
                      {formatPrice(el.total)}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <DynamicTable
          data={data?.orders || []}
          columns={columns}
          loading={loading}
          serverSide
          searchText={searchText}
          onSearchChange={(v) => {
            setSearchText(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search by Customer Name"
          filters={[
            {
              title: t("Status"),
              options: [
                { label: t("PageOrderDelivered"), value: "Delivered" },
                { label: t("PageOrderPending"), value: "Pending" },
                { label: t("PageOrderProcessing"), value: "Processing" },
                { label: t("OrderCancel"), value: "Cancel" },
              ],
              value: status,
              onChange: (v) => {
                setStatus(v);
                setCurrentPage(1);
              },
            },
            {
              title: t("Orderlimits"),
              options: [
                { label: t("DaysOrders5"), value: "5" },
                { label: t("DaysOrders7"), value: "7" },
                { label: t("DaysOrders15"), value: "15" },
                { label: t("DaysOrders30"), value: "30" },
              ],
              value: time,
              onChange: (v) => {
                setTime(v);
                setCurrentPage(1);
              },
            },
            {
              title: t("Method"),
              options: [
                { label: t("Cash"), value: "Cash" },
                { label: t("Card"), value: "Card" },
                { label: t("Credit"), value: "Credit" },
              ],
              value: method,
              onChange: (v) => {
                setMethod(v);
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
          totalCount={data?.totalDoc || 0}
          totalPages={Math.ceil((data?.totalDoc || 0) / pageSize)}
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

export default Orders;
