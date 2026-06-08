import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Star,
  Truck,
  CheckCircle,
  XCircle,
  DollarSign,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  History,
} from "lucide-react";
import { FiZoomIn } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

//internal import
import DeliveryBoyServices from "@/services/DeliveryBoyServices";
import CardItem from "@/components/dashboard/CardItem";
import AnimatedContent from "@/components/common/AnimatedContent";
import Loading from "@/components/preloader/Loading";
import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { SectionTitle } from "@/components/common/SectionTitle";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import OrderTrackingHistoryModal from "@/components/modal/OrderTrackingHistoryModal";

const DeliveryBoyDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { currency, formatPrice, showDateFormat, showingTranslateValue } =
    useUtilsFunction();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [trackingHistoryOrderId, setTrackingHistoryOrderId] = useState(null);

  // Fetch delivery boy details
  const {
    data: deliveryBoy,
    isLoading: loadingDetails,
    error: detailsError,
  } = useQuery({
    queryKey: ["delivery-boy", id],
    queryFn: () => DeliveryBoyServices.getDeliveryBoyById(id),
    enabled: !!id,
  });

  // Fetch delivery boy orders
  const { data: ordersData, isLoading: loadingOrders } = useQuery({
    queryKey: ["delivery-boy-orders", id, currentPage, pageSize],
    queryFn: () =>
      DeliveryBoyServices.getDeliveryBoyOrders(id, {
        page: currentPage,
        limit: pageSize,
      }),
    enabled: !!id,
  });

  const orders = ordersData?.orders || [];
  const totalDoc = ordersData?.totalDoc || 0;

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
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Link to={`/order/${row.original._id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="View Invoice"
              >
                <FiZoomIn className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Delivery History"
              onClick={() => setTrackingHistoryOrderId(row.original._id)}
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [formatPrice, showDateFormat],
  );

  if (loadingDetails) {
    return <Loading loading={true} />;
  }

  if (detailsError || !deliveryBoy) {
    return (
      <AnimatedContent>
        <div className="flex flex-col items-center justify-center py-20">
          <Truck className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">Delivery Boy Not Found</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {detailsError?.message ||
              "The delivery boy you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/delivery-boys">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Delivery Boys
            </Button>
          </Link>
        </div>
      </AnimatedContent>
    );
  }

  const displayName =
    showingTranslateValue(deliveryBoy?.name) || deliveryBoy?.email || "Unknown";

  return (
    <AnimatedContent>
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between pt-4 lg:pt-8">
        <SectionTitle
          title={`${displayName} - Details`}
          description="View delivery boy profile, stats, and assigned orders"
        />
        <Link
          to="/delivery-boys"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Delivery Boys
        </Link>
      </div>

      {/* Profile Card & Stats Cards */}
      <div className="grid gap-4 mb-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="relative overflow-hidden group border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 bg-card h-full">
            <CardContent className="p-3.5 flex flex-col relative z-10 w-full mb-0 bg-transparent h-full">
              <div className="flex items-center gap-3 mb-2 border-b border-border/50 pb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-background border-2 border-border shadow-sm">
                  {deliveryBoy?.image ? (
                    <img
                      src={deliveryBoy.image}
                      alt={displayName}
                      className="w-full h-full object-cover bg-muted"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-primary bg-muted">
                      {displayName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <h3 className="text-base font-bold truncate w-full pr-2 leading-none">{displayName}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                      {deliveryBoy?.averageRating || 0}
                    </div>
                    <span className="text-muted-foreground text-[10px] font-medium">
                      ({deliveryBoy?.totalRatings || 0} reviews)
                    </span>
                  </div>
                  <span
                    className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      deliveryBoy?.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                    }`}
                  >
                    {deliveryBoy?.status}
                  </span>
                </div>
              </div>

              <div className="mt-1 space-y-1.5 w-full pt-2 text-left mt-auto">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center justify-center p-1 rounded-md bg-muted/50 text-muted-foreground shrink-0">
                    <Mail className="h-3 w-3" />
                  </div>
                  <span className="font-medium truncate text-[13px]">{deliveryBoy?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center justify-center p-1 rounded-md bg-muted/50 text-muted-foreground shrink-0">
                    <Phone className="h-3 w-3" />
                  </div>
                  <span className="font-medium text-[13px]">{deliveryBoy?.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-left">
                  <div className="flex items-center justify-center p-1 rounded-md bg-muted/50 text-muted-foreground shrink-0 mt-0.5">
                    <MapPin className="h-3 w-3" />
                  </div>
                  <span className="font-medium text-[13px] leading-snug">
                    {[deliveryBoy?.address, deliveryBoy?.city, deliveryBoy?.country]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center justify-center p-1 rounded-md bg-muted/50 text-muted-foreground shrink-0">
                    <Truck className="h-3 w-3" />
                  </div>
                  <span className="capitalize font-medium text-[13px]">
                    {deliveryBoy?.vehicleType} - {deliveryBoy?.vehicleNumber || "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="md:col-span-2 grid gap-4 grid-cols-2 lg:grid-cols-3">
          <CardItem
            title="Total Deliveries"
            Icon={Truck}
            className="text-blue-500 bg-blue-500/10"
            quantity={deliveryBoy?.totalDeliveries || 0}
          />
          <CardItem
            title="Completed"
            Icon={CheckCircle}
            className="text-emerald-500 bg-emerald-500/10"
            quantity={deliveryBoy?.completedDeliveries || 0}
          />
          <CardItem
            title="Cancelled"
            Icon={XCircle}
            className="text-red-500 bg-red-500/10"
            quantity={deliveryBoy?.cancelledDeliveries || 0}
          />
          <CardItem
            title="Avg. Rating"
            Icon={Star}
            className="text-yellow-500 bg-yellow-500/10"
            quantity={deliveryBoy?.averageRating || 0}
          />
          <CardItem
            title="Total Earnings"
            Icon={DollarSign}
            className="text-indigo-500 bg-indigo-500/10"
            quantity={formatPrice(deliveryBoy?.totalEarnings || 0)}
          />
          <CardItem
            title="Availability"
            Icon={CheckCircle}
            className="text-purple-500 bg-purple-500/10"
            quantity={deliveryBoy?.availability?.replace("-", " ") || "N/A"}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Assigned Orders</h3>
          <p className="text-sm text-muted-foreground">
            All orders assigned to this delivery boy
          </p>
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

      <OrderTrackingHistoryModal
        open={!!trackingHistoryOrderId}
        onClose={() => setTrackingHistoryOrderId(null)}
        orderId={trackingHistoryOrderId}
        selfService={false}
      />
    </AnimatedContent>
  );
};

export default DeliveryBoyDetails;
