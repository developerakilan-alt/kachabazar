"use client";

import dayjs from "dayjs";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Truck, MapPin, Package, RefreshCw } from "lucide-react";

//internal import
import OrderTable from "@components/order/OrderTable";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { refreshShiprocketStatus } from "@lib/actions/order.actions";

const Invoice = ({ data, printRef, globalSetting }) => {
  const { formatPrice } = useUtilsFunction();
  const [refreshing, setRefreshing] = useState(false);
  const [srStatus, setSrStatus] = useState(data?.shiprocket?.status || null);
  const [srOrderStatus, setSrOrderStatus] = useState(data?.status || null);
  const [refreshMsg, setRefreshMsg] = useState(null);

  const handleRefresh = useCallback(async () => {
    if (!data?._id) return;
    setRefreshing(true);
    setRefreshMsg(null);
    const res = await refreshShiprocketStatus(data._id);
    if (res.success) {
      setSrStatus(res.data.shiprocket?.status || srStatus);
      setSrOrderStatus(res.data.orderStatus || srOrderStatus);
      setRefreshMsg("Status updated");
    } else {
      setRefreshMsg(res.error || "Refresh failed");
    }
    setRefreshing(false);
  }, [data?._id, srStatus, srOrderStatus]);

  return (
    <div ref={printRef}>
      <div className="bg-primary/5 p-8 rounded-t-xl">
        <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col lg:items-center justify-between pb-4 border-b border-border">
          <div>
            <h1 className="font-bold text-2xl uppercase">Invoice</h1>
            <h6 className="text-muted-foreground">
              Status :{" "}
              {data?.status === "Delivered" && (
                <span className="text-primary">{data?.status}</span>
              )}
              {data?.status === "POS-Completed" && (
                <span className="text-primary">{data?.status}</span>
              )}
              {data?.status === "Pending" && (
                <span className="text-orange-500">{data?.status}</span>
              )}
              {data?.status === "Cancel" && (
                <span className="text-red-500">{data?.status}</span>
              )}
              {data?.status === "Processing" && (
                <span className="text-indigo-500">{data?.status}</span>
              )}
              {data?.status === "Out-for-delivery" && (
                <span className="text-teal-500">{data?.status}</span>
              )}
              {data?.status === "Deleted" && (
                <span className="text-red-700">{data?.status}</span>
              )}
            </h6>
          </div>
          <div className="lg:text-right text-left">
            <h2 className="text-lg font-semibold mt-4 lg:mt-0 md:mt-0">
              <Link href="/">
                <Image
                  width={110}
                  height={40}
                  src={
                    globalSetting?.invoice_logo ||
                    globalSetting?.logo ||
                    "/logo/logo-color.png"
                  }
                  alt="logo"
                />
              </Link>
            </h2>
            <p className="text-sm text-muted-foreground">
              {globalSetting?.address ||
                "Cecilia Chapman, 561-4535 Nulla LA, <br /> United States 96522"}
            </p>
          </div>
        </div>
        <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col justify-between pt-4">
          <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
            <span className="font-bold text-sm uppercase text-muted-foreground block">
              Date
            </span>
            <span className="text-sm text-muted-foreground block">
              {data?.createdAt !== undefined && (
                <span>{dayjs(data?.createdAt).format("MMMM D, YYYY")}</span>
              )}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
            <span className="font-bold text-sm uppercase text-muted-foreground block">
              Invoice No.
            </span>
            <span className="text-sm text-muted-foreground block">
              #{data?.invoice}
            </span>
          </div>
          <div className="flex flex-col lg:text-right text-left">
            <span className="font-bold text-sm uppercase text-muted-foreground block">
              Invoice To.
            </span>
            <span className="text-sm text-muted-foreground block">
              {data?.user_info?.name} <br />
              {data?.user_info?.email}{" "}
              <span className="ml-2">{data?.user_info?.contact}</span>
              <br />
              {data?.user_info?.address}
              <br />
              {data?.user_info?.city} {data?.user_info?.state || data?.user_info?.country} {data?.user_info?.zipCode}
            </span>
          </div>
        </div>
      </div>
      <div className="overflow-hidden lg:overflow-visible px-8 my-10">
        <div className="-my-2 overflow-x-auto">
          <table className="table-auto min-w-full border border-border divide-y divide-border">
            <thead className="bg-muted">
              <tr className="text-xs bg-muted">
                <th
                  scope="col"
                  className="font-semibold px-6 py-2 text-muted-foreground uppercase tracking-wider text-left"
                >
                  Sr.
                </th>
                <th
                  scope="col"
                  className="font-semibold px-6 py-2 text-muted-foreground uppercase tracking-wider text-left"
                >
                  Product Name
                </th>
                <th
                  scope="col"
                  className="font-semibold px-6 py-2 text-muted-foreground uppercase tracking-wider text-center"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="font-semibold px-6 py-2 text-muted-foreground uppercase tracking-wider text-center"
                >
                  Item Price
                </th>

                <th
                  scope="col"
                  className="font-semibold px-6 py-2 text-muted-foreground uppercase tracking-wider text-right"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <OrderTable data={data} />
          </table>
        </div>
      </div>

      <div className="border-t border-b border-border p-10 bg-accent">
        <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col justify-between pt-4">
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold text-sm uppercase text-muted-foreground block">
              Payment Method
            </span>
            <span className="text-sm text-muted-foreground font-semibold block">
              {data?.paymentMethod}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold text-sm uppercase text-muted-foreground block">
              Shipping Cost
            </span>
            <span className="text-sm text-muted-foreground font-semibold block">
              {formatPrice(data?.shippingCost)}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold text-sm uppercase text-muted-foreground block">
              Discount
            </span>
            <span className="text-sm text-muted-foreground font-semibold block">
              {formatPrice(data?.discount)}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold text-sm uppercase text-muted-foreground block">
              GST (3%)
            </span>
            <span className="text-sm text-muted-foreground font-semibold block">
              {formatPrice(data?.gst)}
            </span>
          </div>
          <div className="flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold text-sm uppercase text-muted-foreground block">
              Total Amount
            </span>
            <span className="text-2xl font-bold text-red-500 block">
              {formatPrice(data?.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Tracking & Delivery Info */}
      {data?.trackingId && (
        <div className="border-t border-border p-8 bg-muted/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">
                    Tracking ID
                  </span>
                  <span className="font-mono font-semibold text-primary text-sm">
                    {data?.trackingId}
                  </span>
                </div>
              </div>

              {data?.trackingStatus && (
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">
                    Status
                  </span>
                  <span className="text-sm capitalize font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {data.trackingStatus.replace(/-/g, " ")}
                  </span>
                </div>
              )}

              {data?.deliveryBoyName && (
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground font-medium block">
                      Delivery Partner
                    </span>
                    <span className="text-sm font-medium">
                      {data.deliveryBoyName}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/track/${data.trackingId}`}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              Track Order
            </Link>
          </div>
        </div>
      )}

      {/* ShipRocket Shipping Info */}
      {data?.shiprocket?.awb && (
        <div className="border-t border-border p-8 bg-muted/50">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="text-xs text-muted-foreground font-medium block">
                  AWB Number
                </span>
                <span className="font-mono font-semibold text-sm">
                  {data.shiprocket.awb}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                ShipRocket Status
              </span>
              <span className="text-sm capitalize font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {(srStatus || "created").replace(/_/g, " ")}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                Order Status
              </span>
              <span className="text-sm capitalize font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {srOrderStatus || data?.status || "pending"}
              </span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="print:hidden inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          {refreshMsg && (
            <p className="text-xs text-muted-foreground mt-2">{refreshMsg}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Invoice;
