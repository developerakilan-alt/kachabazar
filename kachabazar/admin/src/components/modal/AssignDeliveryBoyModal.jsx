import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Truck, Search, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeliveryBoyServices from "@/services/DeliveryBoyServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const AssignDeliveryBoyModal = ({
  open,
  onClose,
  orderIds = [],
  onSuccess,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showingTranslateValue } = useUtilsFunction();
  const [search, setSearch] = useState("");
  const [selectedBoy, setSelectedBoy] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all active delivery boys
  const { data, isLoading } = useQuery({
    queryKey: ["delivery-boys-active"],
    queryFn: () =>
      DeliveryBoyServices.getAllDeliveryBoys({
        status: "active",
        limit: 100,
        page: 1,
      }),
    enabled: open,
    staleTime: 2 * 60 * 1000,
  });

  const deliveryBoys = useMemo(() => {
    const list = data?.deliveryBoys || data || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (boy) =>
        (showingTranslateValue(boy?.name) || "").toLowerCase().includes(q) ||
        (boy?.phone || "").includes(q) ||
        (boy?.email || "").toLowerCase().includes(q),
    );
  }, [data, search, showingTranslateValue]);

  const handleAssign = async () => {
    if (!selectedBoy || !orderIds.length) return;
    try {
      setIsSubmitting(true);
      const res = await DeliveryBoyServices.assignDeliveryBoy({
        orderIds,
        deliveryBoyId: selectedBoy._id,
      });
      notifySuccess(res?.message || "Delivery Boy assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-boys"] });
      onSuccess?.();
      handleClose();
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearch("");
    setSelectedBoy(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {t("AssignDeliveryBoy")}
          </DialogTitle>
          <DialogDescription>
            {orderIds.length > 1
              ? `Assign a delivery partner to ${orderIds.length} selected orders`
              : "Select a delivery partner for this order"}
          </DialogDescription>
        </DialogHeader>

        {/* Order count badge */}
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-xs">
            {orderIds.length} order{orderIds.length > 1 ? "s" : ""} selected
          </Badge>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search delivery boy by name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>

        {/* Delivery boys list */}
        <ScrollArea className="h-[300px] rounded-md border">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-10">
              <img src={spinnerLoadingImage} alt="Loading" width={30} />
            </div>
          ) : deliveryBoys.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-muted-foreground">
              <Truck className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No delivery boys found</p>
            </div>
          ) : (
            <div className="p-1">
              {deliveryBoys.map((boy) => {
                const isSelected = selectedBoy?._id === boy._id;
                const name = showingTranslateValue(boy?.name) || boy?.email;
                return (
                  <button
                    key={boy._id}
                    type="button"
                    onClick={() => setSelectedBoy(isSelected ? null : boy)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30 ring-1 ring-primary/20"
                        : "hover:bg-muted/50 border border-transparent"
                    }`}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={boy.image} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                        {name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {name}
                        </span>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground truncate">
                          {boy.phone}
                        </span>
                        <span className="text-xs capitalize text-muted-foreground">
                          {boy.vehicleType}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium">
                          {boy.averageRating || 0}
                        </span>
                      </div>
                      <Badge
                        variant={
                          boy.availability === "available"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[10px] px-1.5 py-0 mt-0.5"
                      >
                        {boy.availability === "available"
                          ? "Free"
                          : boy.availability?.replace("-", " ")}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            {t("Cancel")}
          </Button>
          {isSubmitting ? (
            <Button disabled type="button">
              <img src={spinnerLoadingImage} alt="Loading" width={20} />
              <span className="ml-2">{t("Processing")}</span>
            </Button>
          ) : (
            <Button onClick={handleAssign} disabled={!selectedBoy}>
              <Truck className="mr-2 h-4 w-4" />
              {t("Assign")}{" "}
              {selectedBoy ? showingTranslateValue(selectedBoy?.name) : ""}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDeliveryBoyModal;
