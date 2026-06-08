import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Truck,
  Package,
  MapPin,
  XCircle,
  Send,
} from "lucide-react";
import DeliveryBoyServices from "@/services/DeliveryBoyServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const trackingStatuses = [
  {
    value: "picked-up",
    label: "Picked Up",
    icon: Package,
    description: "Order has been picked up from the store",
    color:
      "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950",
    activeColor: "border-indigo-500 bg-indigo-100 dark:bg-indigo-900",
  },
  {
    value: "on-the-way",
    label: "On The Way",
    icon: Truck,
    description: "Out for delivery to customer",
    color:
      "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950",
    activeColor: "border-purple-500 bg-purple-100 dark:bg-purple-900",
  },
  {
    value: "nearby",
    label: "Nearby",
    icon: MapPin,
    description: "Almost at the delivery address",
    color: "border-cyan-200 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950",
    activeColor: "border-cyan-500 bg-cyan-100 dark:bg-cyan-900",
  },
  {
    value: "delivered",
    label: "Delivered",
    icon: CheckCircle,
    description: "Order successfully delivered to customer",
    color:
      "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
    activeColor: "border-green-500 bg-green-100 dark:bg-green-900",
  },
  {
    value: "cancelled",
    label: "Cancel Delivery",
    icon: XCircle,
    description: "Cannot complete this delivery",
    color: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
    activeColor: "border-red-500 bg-red-100 dark:bg-red-900",
  },
];

const UpdateTrackingStatusModal = ({
  open,
  onClose,
  orderId,
  currentStatus,
  onSuccess,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ orderId, body }) =>
      DeliveryBoyServices.updateTrackingStatus(orderId, body),
    onSuccess: (data) => {
      notifySuccess(data.message || "Status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-stats"] });
      queryClient.invalidateQueries({ queryKey: ["tracking-history"] });
      setSelectedStatus("");
      setComment("");
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || "Failed to update status");
    },
  });

  const handleSubmit = () => {
    if (!selectedStatus) {
      notifyError("Please select a status");
      return;
    }
    mutation.mutate({
      orderId,
      body: {
        trackingStatus: selectedStatus,
        message: comment || undefined,
      },
    });
  };

  // Filter out statuses that are "before" or equal to current
  const statusOrder = [
    "order-placed",
    "confirmed",
    "preparing",
    "ready-for-pickup",
    "picked-up",
    "on-the-way",
    "nearby",
    "delivered",
  ];
  const currentIndex = statusOrder.indexOf(currentStatus || "");

  const availableStatuses = trackingStatuses.filter((s) => {
    if (s.value === "cancelled") return true; // always available
    const sIndex = statusOrder.indexOf(s.value);
    return sIndex > currentIndex;
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setSelectedStatus("");
          setComment("");
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Update Delivery Status
          </DialogTitle>
        </DialogHeader>

        {currentStatus && (
          <div className="p-2 rounded-md bg-muted/50 text-sm">
            Current:{" "}
            <span className="font-medium capitalize">
              {currentStatus?.replace(/-/g, " ")}
            </span>
          </div>
        )}

        <div className="space-y-2">
          {availableStatuses.map((status) => {
            const Icon = status.icon;
            const isSelected = selectedStatus === status.value;
            return (
              <button
                key={status.value}
                type="button"
                onClick={() => setSelectedStatus(status.value)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                  isSelected ? status.activeColor : status.color
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${isSelected ? "opacity-100" : "opacity-60"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{status.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {status.description}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Comment{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </label>
          <Textarea
            placeholder="Add a note about this status update..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            This comment will be sent as a notification to the customer.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedStatus || mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTrackingStatusModal;
