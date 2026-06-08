import { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Star,
  Truck,
  CheckCircle,
  XCircle,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Package,
  Clock,
  Calendar,
  Send,
  Eye,
  History,
} from "lucide-react";
import { FiZoomIn } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//internal import
import DeliveryBoyServices from "@/services/DeliveryBoyServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import Loading from "@/components/preloader/Loading";
import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { SectionTitle } from "@/components/common/SectionTitle";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { AdminContext } from "@/context/AdminContext";
import OrderTrackingHistoryModal from "@/components/modal/OrderTrackingHistoryModal";
import UpdateTrackingStatusModal from "@/components/modal/UpdateTrackingStatusModal";

const MyDashboard = () => {
  const { t } = useTranslation();
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const queryClient = useQueryClient();
  const { currency, formatPrice, showDateFormat, showingTranslateValue } =
    useUtilsFunction();

  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [orderFilter, setOrderFilter] = useState("all");

  // Modal state
  const [trackingHistoryOrderId, setTrackingHistoryOrderId] = useState(null);
  const [updateStatusOrder, setUpdateStatusOrder] = useState(null);

  // Fetch my stats
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["my-stats"],
    queryFn: () => DeliveryBoyServices.getMyStats(),
  });

  // Fetch my orders
  const { data: ordersData, isLoading: loadingOrders } = useQuery({
    queryKey: [
      "my-orders",
      currentPage,
      pageSize,
      orderFilter !== "all" ? orderFilter : undefined,
    ],
    queryFn: () =>
      DeliveryBoyServices.getMyOrders({
        page: currentPage,
        limit: pageSize,
        status: orderFilter !== "all" ? orderFilter : undefined,
      }),
  });

  const orders = ordersData?.orders || [];
  const totalDoc = ordersData?.totalDoc || 0;

  // Profile info from cookie
  const profileName =
    showingTranslateValue(adminInfo?.name) ||
    adminInfo?.email ||
    "Delivery Boy";

  const columns = useMemo(
    () => [
      {
        accessorKey: "invoice",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Invoice" />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-sm">#{row.original.invoice}</span>
        ),
      },
      {
        accessorKey: "trackingId",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Tracking ID" />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
            {row.original.trackingId || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "user_info.name",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Customer" />
        ),
        cell: ({ row }) => (
          <div>
            <span className="text-sm">{row.original.user_info?.name}</span>
            <p className="text-xs text-muted-foreground">
              {row.original.user_info?.contact}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "total",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Total" />
        ),
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            {formatPrice(row.original.total)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => <Status status={row.original.status} />,
      },
      {
        accessorKey: "trackingStatus",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Tracking" />
        ),
        cell: ({ row }) => (
          <span className="text-xs capitalize bg-primary/10 text-primary px-2 py-1 rounded-full">
            {row.original.trackingStatus?.replace(/-/g, " ") || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {showDateFormat(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const order = row.original;
          const isActive =
            order.status === "pending" ||
            order.status === "processing" ||
            order.status === "out-for-delivery";

          return (
            <div className="flex items-center gap-1">
              {/* View Invoice */}
              <Link to={`/order/${order._id}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="View Invoice"
                >
                  <FiZoomIn className="h-4 w-4" />
                </Button>
              </Link>

              {/* Tracking History */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Delivery History"
                onClick={() => setTrackingHistoryOrderId(order._id)}
              >
                <History className="h-4 w-4" />
              </Button>

              {/* Update Status (only for active orders) */}
              {isActive && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary"
                  title="Update Status"
                  onClick={() =>
                    setUpdateStatusOrder({
                      id: order._id,
                      trackingStatus: order.trackingStatus,
                    })
                  }
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [formatPrice, showDateFormat],
  );

  if (loadingStats) {
    return <Loading loading={true} />;
  }

  return (
    <AnimatedContent>
      <div className="mb-6 pt-4 lg:pt-8">
        <SectionTitle
          title={`Welcome, ${profileName}`}
          description="Your delivery dashboard — manage orders and track your performance"
        />
      </div>

      {/* Profile + Stats Row */}
      <div className="grid gap-4 mb-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Deliveries</p>
              <p className="text-xl font-bold">{stats?.totalDeliveries || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-xl font-bold">
                {stats?.completedDeliveries || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/30">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Orders</p>
              <p className="text-xl font-bold">{stats?.activeOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/30">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cancelled</p>
              <p className="text-xl font-bold">
                {stats?.cancelledDeliveries || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900/30">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Rating</p>
              <p className="text-xl font-bold">{stats?.averageRating || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg dark:bg-emerald-900/30">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
              <p className="text-xl font-bold">
                {formatPrice(stats?.totalEarnings || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly/Today summary */}
      <div className="grid gap-4 mb-6 md:grid-cols-3">
        <div className="bg-card rounded-lg shadow-sm border p-4 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              This Month Deliveries
            </p>
            <p className="text-lg font-bold">
              {stats?.thisMonthDeliveries || 0}
            </p>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm border p-4 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Today Deliveries</p>
            <p className="text-lg font-bold">{stats?.todayDeliveries || 0}</p>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm border p-4 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">This Month Earnings</p>
            <p className="text-lg font-bold">
              {formatPrice(stats?.thisMonthEarnings || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Availability toggle */}
      <div className="flex items-center justify-between mb-4 bg-card rounded-lg shadow-sm border p-4">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Your Availability</p>
            <p className="text-xs text-muted-foreground">
              Toggle your status to receive new delivery assignments
            </p>
          </div>
        </div>
        <Select
          defaultValue={stats?.availability || "available"}
          onValueChange={async (value) => {
            try {
              await DeliveryBoyServices.updateAvailability({
                availability: value,
              });
              queryClient.invalidateQueries({ queryKey: ["my-stats"] });
            } catch (err) {
              console.error(err);
            }
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Available
              </span>
            </SelectItem>
            <SelectItem value="on-delivery">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                On Delivery
              </span>
            </SelectItem>
            <SelectItem value="offline">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Offline
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-semibold">My Orders</h3>
            <p className="text-sm text-muted-foreground">
              All orders assigned to you
            </p>
          </div>
          <Select value={orderFilter} onValueChange={setOrderFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancel">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="p-4">
          <DynamicTable
            columns={columns}
            data={orders}
            loading={loadingOrders}
            totalDoc={totalDoc}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            sorting={sorting}
            setSorting={setSorting}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </div>
      </div>

      {/* Tracking History Modal */}
      <OrderTrackingHistoryModal
        open={!!trackingHistoryOrderId}
        onClose={() => setTrackingHistoryOrderId(null)}
        orderId={trackingHistoryOrderId}
        selfService={true}
      />

      {/* Update Tracking Status Modal */}
      {updateStatusOrder && (
        <UpdateTrackingStatusModal
          open={!!updateStatusOrder}
          onClose={() => setUpdateStatusOrder(null)}
          orderId={updateStatusOrder.id}
          currentStatus={updateStatusOrder.trackingStatus}
        />
      )}
    </AnimatedContent>
  );
};

export default MyDashboard;
