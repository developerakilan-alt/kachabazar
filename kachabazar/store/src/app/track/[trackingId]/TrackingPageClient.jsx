"use client";

import { useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import {
  Package,
  Truck,
  MapPin,
  Calendar,
  Hash,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

import TrackingTimeline from "@components/tracking/TrackingTimeline";

const TrackingPageClient = ({ trackingId, data, error, success }) => {
  const [iframeError, setIframeError] = useState(false);

  if (!success || error) {
    return (
      <div className="text-center py-20">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">
          {error || "We couldn't find an order with this tracking ID."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  const { order, tracking, shiprocketTracking } = data;
  const courierTracking = order?.courierTracking;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    "out-for-delivery": "bg-teal-100 text-teal-800",
    delivered: "bg-green-100 text-green-800",
    cancel: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold">Track Your Order</h1>
        <p className="text-muted-foreground mt-1">
          Tracking ID:{" "}
          <span className="font-mono font-semibold text-primary">
            {trackingId}
          </span>
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-muted/50 border border-border rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-muted-foreground font-medium block mb-1">
              <Hash className="h-3 w-3 inline mr-1" />
              Invoice
            </span>
            <span className="font-semibold text-sm">#{order?.invoice}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium block mb-1">
              <Calendar className="h-3 w-3 inline mr-1" />
              Order Date
            </span>
            <span className="font-semibold text-sm">
              {dayjs(order?.createdAt).format("MMM D, YYYY")}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium block mb-1">
              Status
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                statusColors[order?.status?.toLowerCase()] ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {order?.status}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium block mb-1">
              Total
            </span>
            <span className="font-bold text-lg text-primary">
              ${order?.total?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        {order?.user_info && (
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground font-medium block mb-1">
              <MapPin className="h-3 w-3 inline mr-1" />
              Delivery Address
            </span>
            <p className="text-sm">
              {order.user_info.address}
              {order.city && `, ${order.city}`}
              {order.country && `, ${order.country}`}
              {order.zipCode && ` - ${order.zipCode}`}
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Tracking - Left/Main */}
        <div className="md:col-span-2">
          {/* Courier Tracking Iframe */}
          {courierTracking?.url && !iframeError ? (
            <div className="bg-background border border-border rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {courierTracking.name || "Courier"} Tracking
              </h2>
              <iframe
                src={courierTracking.url}
                title="Courier Tracking"
                className="w-full h-[500px] rounded-lg border border-border"
                onError={() => setIframeError(true)}
                sandbox="allow-scripts allow-same-origin"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                <a
                  href={courierTracking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Open in new tab
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          ) : courierTracking?.url && iframeError ? (
            <div className="bg-background border border-border rounded-xl p-6 mb-6 text-center">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 justify-center">
                <Truck className="h-5 w-5" />
                {courierTracking.name || "Courier"} Tracking
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Unable to load tracking preview. Click below to track directly
                on {courierTracking.name || "the courier site"}.
              </p>
              <a
                href={courierTracking.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Track on {courierTracking.name || "Courier"}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ) : shiprocketTracking?.tracking_data ? (
            <div className="bg-background border border-border rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                ShipRocket Tracking
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">AWB</span>
                  <span className="font-mono font-medium text-right">
                    {order?.shiprocket?.awb || "—"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Courier</span>
                  <span className="font-medium text-right">
                    {shiprocketTracking.tracking_data?.courier_name || "—"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize text-right">
                    {shiprocketTracking.tracking_data?.shipment_status?.toLowerCase().replace(/_/g, " ") || "—"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Current Location</span>
                  <span className="font-medium text-right">
                    {shiprocketTracking.tracking_data?.current_status?.location || "—"}
                  </span>
                </div>
                {shiprocketTracking.tracking_data?.tracking_data?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Tracking History</h4>
                    <div className="space-y-2">
                      {shiprocketTracking.tracking_data.tracking_data.map((entry, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground border-l-2 border-primary pl-3 py-1">
                          <p className="font-medium text-foreground">{entry.status}</p>
                          <p>{entry.location || ""}</p>
                          <p>{entry.date ? dayjs(entry.date).format("MMM D, YYYY h:mm A") : ""}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-background border border-border rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Tracking History
              </h2>
              {tracking?.history && tracking.history.length > 0 ? (
                <TrackingTimeline history={tracking.history} />
              ) : (
                <p className="text-muted-foreground text-sm py-8 text-center">
                  No tracking updates yet. We'll update this as your order
                  progresses.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Tracking Info Summary */}
          {courierTracking?.url && (
            <div className="bg-background border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Courier Details
              </h3>
              <p className="text-sm font-medium">{courierTracking.name || "Courier"}</p>
              {courierTracking.trackingNumber && (
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  #{courierTracking.trackingNumber}
                </p>
              )}
            </div>
          )}

          {/* ShipRocket Tracking Info */}
          {!courierTracking?.url && shiprocketTracking?.tracking_data && (
            <div className="bg-background border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                ShipRocket Shipping
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AWB</span>
                  <span className="font-mono font-medium">
                    {order?.shiprocket?.awb || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Courier</span>
                  <span className="font-medium">
                    {shiprocketTracking.tracking_data?.courier_name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">
                    {shiprocketTracking.tracking_data?.shipment_status?.toLowerCase().replace(/_/g, " ") || "—"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Estimated Delivery */}
          {tracking?.estimatedDeliveryTime && (
            <div className="bg-background border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Estimated Delivery
              </h3>
              <p className="text-lg font-bold text-primary">
                {dayjs(tracking.estimatedDeliveryTime).format("MMM D, YYYY")}
              </p>
              <p className="text-xs text-muted-foreground">
                {dayjs(tracking.estimatedDeliveryTime).format("h:mm A")}
              </p>
            </div>
          )}

          {/* Order Items Summary */}
          {order?.cart && order.cart.length > 0 && (
            <div className="bg-background border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3">
                Order Items ({order.cart.length})
              </h3>
              <div className="space-y-2">
                {order.cart.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-muted-foreground truncate flex-1 mr-2">
                      {item.title?.en || item.title}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
                {order.cart.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{order.cart.length - 5} more items
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPageClient;
