import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CheckCircle,
  Truck,
  MapPin,
  XCircle,
  Clock,
  ArrowRight,
  User,
} from "lucide-react";
import DeliveryBoyServices from "@/services/DeliveryBoyServices";

const statusConfig = {
  "order-placed": {
    icon: Package,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  confirmed: {
    icon: CheckCircle,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  preparing: {
    icon: Clock,
    color:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    dot: "bg-yellow-500",
  },
  "ready-for-pickup": {
    icon: Package,
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  "picked-up": {
    icon: Truck,
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    dot: "bg-indigo-500",
  },
  "on-the-way": {
    icon: Truck,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    dot: "bg-purple-500",
  },
  nearby: {
    icon: MapPin,
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    dot: "bg-cyan-500",
  },
  delivered: {
    icon: CheckCircle,
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    dot: "bg-green-500",
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-500",
  },
  returned: {
    icon: XCircle,
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    dot: "bg-orange-500",
  },
};

const OrderTrackingHistoryModal = ({ open, onClose, orderId, selfService }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["tracking-history", orderId],
    queryFn: () =>
      selfService
        ? DeliveryBoyServices.getMyOrderTrackingHistory(orderId)
        : DeliveryBoyServices.getOrderTrackingHistory(orderId),
    enabled: !!orderId && open,
  });

  const order = data?.order;
  const tracking = data?.tracking;
  const history = tracking?.history || [];

  // Sort history by timestamp descending (newest first)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Delivery History
            {order && (
              <Badge variant="outline" className="ml-2 font-mono text-xs">
                #{order.invoice}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : sortedHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Package className="h-10 w-10 mb-3" />
            <p className="text-sm">No tracking history available</p>
            {order && (
              <p className="text-xs mt-1">
                Current status:{" "}
                <span className="capitalize font-medium">
                  {(order.trackingStatus || order.status || "pending")?.replace(
                    /-/g,
                    " ",
                  )}
                </span>
              </p>
            )}
          </div>
        ) : (
          <ScrollArea className="max-h-[450px] pr-4">
            {/* Current status summary */}
            {order && (
              <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Current Status
                  </p>
                  <p className="text-sm font-medium capitalize">
                    {(
                      tracking?.status ||
                      order.trackingStatus ||
                      "pending"
                    )?.replace(/-/g, " ")}
                  </p>
                </div>
                {order.deliveryBoyName && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Delivery Boy
                    </p>
                    <p className="text-sm font-medium">
                      {order.deliveryBoyName}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            <div className="relative">
              {sortedHistory.map((entry, index) => {
                const config =
                  statusConfig[entry.status] || statusConfig["order-placed"];
                const Icon = config.icon;
                const isLast = index === sortedHistory.length - 1;

                return (
                  <div key={index} className="flex gap-3 pb-4">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${config.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      {!isLast && (
                        <div className="w-0.5 flex-1 bg-border mt-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium capitalize">
                          {entry.status?.replace(/-/g, " ")}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {entry.message}
                      </p>
                      {entry.updatedBy && (
                        <div className="flex items-center gap-1 mt-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground capitalize">
                            {entry.updatedBy === "delivery-boy"
                              ? "Delivery Boy"
                              : entry.updatedBy}
                          </span>
                        </div>
                      )}
                      {entry.location?.address && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {entry.location.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderTrackingHistoryModal;
