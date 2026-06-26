import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import React, { useContext, useRef, useState } from "react";
import { FiPrinter, FiMail } from "react-icons/fi";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Truck, Send, ExternalLink, Package } from "lucide-react";

//internal import
import useAsync from "@/hooks/useAsync";
import useError from "@/hooks/useError";
import Status from "@/components/table/Status";
import { notifyError, notifySuccess } from "@/utils/toast";
import { AdminContext } from "@/context/AdminContext";
import OrderServices from "@/services/OrderServices";
import ShiprocketServices from "@/services/ShiprocketServices";
import Invoice from "@/components/invoice/Invoice";
import Loading from "@/components/preloader/Loading";
import PageTitle from "@/components/Typography/PageTitle";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import useDisableForDemo from "@/hooks/useDisableForDemo";
import InvoiceForDownload from "@/components/invoice/InvoiceForDownload";

const OrderInvoice = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { id } = useParams();
  const printRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;

  const { data, loading, error } = useAsync(() =>
    OrderServices.getOrderById(id),
  );

  const { handleErrorNotification } = useError();
  const { handleDisableForDemo } = useDisableForDemo();

  // Push order to Shiprocket
  const [pushingToShiprocket, setPushingToShiprocket] = useState(false);
  const [refreshingShiprocket, setRefreshingShiprocket] = useState(false);

  const handlePushToShiprocket = async () => {
    if (handleDisableForDemo()) return;
    try {
      setPushingToShiprocket(true);
      const res = await ShiprocketServices.createOrder(id);
      notifySuccess(res?.message || "Order pushed to ShipRocket successfully!");
      window.location.reload();
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setPushingToShiprocket(false);
    }
  };

  const handleRefreshShiprocket = async () => {
    if (handleDisableForDemo()) return;
    try {
      setRefreshingShiprocket(true);
      const res = await ShiprocketServices.refreshStatus(id);
      const srLabel = (res?.tracking?.status || "updated")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      notifySuccess(
        `ShipRocket: ${srLabel} | Order: ${res?.orderStatus || "—"}`,
      );
      window.location.reload();
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setRefreshingShiprocket(false);
    }
  };

  // console.log("data", data);

  const { currency, globalSetting, showDateFormat, formatPrice } =
    useUtilsFunction();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    // pageStyle: pageStyle,
    documentTitle: data?.invoice,
  });

  const handleEmailInvoice = async (inv) => {
    // console.log("inv", inv);
    if (handleDisableForDemo()) {
      return; // Exit the function if the feature is disabled
    }

    setIsSubmitting(true);
    try {
      const updatedData = {
        ...inv,
        date: showDateFormat(inv.createdAt),
        company_info: {
          currency: currency,
          logo: globalSetting?.invoice_logo || globalSetting?.logo,
          vat_number: globalSetting?.vat_number,
          company: globalSetting?.company_name,
          address: globalSetting?.address,
          phone: globalSetting?.contact,
          email: globalSetting?.email,
          website: globalSetting?.website,
          from_email: globalSetting?.from_email,
        },
      };
      // console.log("updatedData", updatedData);

      // return setIsSubmitting(false);
      const res = await OrderServices.sendEmailInvoiceToCustomer(updatedData);
      notifySuccess(res.message);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      handleErrorNotification(err, "handleEmailInvoice");
    }
  };

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between py-8 gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle> {t("InvoicePageTittle")} </PageTitle>
        </div>
      </div>
      <div
        ref={printRef}
        className="bg-card mb-4 p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden"
      >
        {!loading && (
          <div className="">
            <div className="flex lg:flex-row md:flex-row flex-col lg:items-center justify-between pb-4 border-b border-border">
              <h1 className="font-bold font-serif text-xl uppercase">
                {t("InvoicePageTittle")}
                <div className="flex">
                  <p className="text-xs mt-1 text-muted-foreground">
                    {t("InvoiceStatus")}
                  </p>
                  <span className="pl-2 font-medium text-xs capitalize">
                    <Status status={data.status} />
                  </span>
                </div>
              </h1>
              <div className="lg:text-right text-left">
                <h2 className="lg:flex lg:justify-end text-lg font-serif font-semibold mt-4 lg:mt-0 lg:ml-0 md:mt-0">
                  <img
                    src={
                      globalSetting?.invoice_logo ||
                      (theme === "dark"
                        ? globalSetting?.logo_light || globalSetting?.logo
                        : globalSetting?.logo || globalSetting?.logo_light)
                    }
                    alt="hautecouturejewellery"
                    className="h-10 w-auto object-contain"
                  />
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {globalSetting?.address} <br />
                  {globalSetting?.contact} <br />{" "}
                  <span> {globalSetting?.email} </span> <br />
                  {globalSetting?.website}
                </p>
              </div>
            </div>
            <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
              <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                <span className="font-bold font-serif text-sm uppercase text-muted-foreground block">
                  {t("InvoiceDate")}
                </span>
                <span className="text-sm text-muted-foreground block">
                  {showDateFormat(data?.createdAt)}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                <span className="font-bold font-serif text-sm uppercase text-muted-foreground block">
                  {t("InvoiceNo")}
                </span>
                <span className="text-sm text-muted-foreground block">
                  #{data?.invoice}
                </span>
              </div>
              <div className="flex flex-col lg:text-right text-left">
                <span className="font-bold font-serif text-sm uppercase text-muted-foreground block">
                  {t("InvoiceTo")}
                </span>
                <span className="text-sm text-muted-foreground block">
                  {data?.user_info?.name} <br />
                  {data?.user_info?.email}{" "}
                  <span className="ml-2">{data?.user_info?.contact}</span>
                  <br />
                  {data?.user_info?.address?.substring(0, 30)}
                  <br />
                  {data?.user_info?.city}, {data?.user_info?.country},{" "}
                  {data?.user_info?.zipCode}
                </span>
              </div>
            </div>
          </div>
        )}
        <div>
          {loading ? (
            <Loading loading={loading} />
          ) : error ? (
            <span className="text-center mx-auto text-red-500">{error}</span>
          ) : (
            <TableContainer className="my-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Sr")}</TableHead>
                    <TableHead>Product Title</TableHead>
                    <TableHead className="text-center">
                      {t("Quantity")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("ItemPrice")}
                    </TableHead>
                    <TableHead className="text-right">{t("Amount")}</TableHead>
                  </TableRow>
                </TableHeader>
                <Invoice data={data} />
              </Table>
            </TableContainer>
          )}
        </div>

        {!loading && (
          <div className="border rounded-xl border-border p-8 py-6 bg-muted">
            <div className="flex lg:flex-row md:flex-row flex-col justify-between">
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-muted-foreground block">
                  {t("InvoicepaymentMethod")}
                </span>
                <span className="text-sm text-muted-foreground font-semibold font-serif block">
                  {data.paymentMethod}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-muted-foreground block">
                  {t("ShippingCost")}
                </span>
                <span className="text-sm text-muted-foreground font-semibold font-serif block">
                  {formatPrice(data.shippingCost)}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-muted-foreground block">
                  {t("InvoiceDicount")}
                </span>
                <span className="text-sm text-muted-foreground font-semibold font-serif block">
                  {formatPrice(data.discount)}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-muted-foreground block">
                  GST (3%)
                </span>
                <span className="text-sm text-muted-foreground font-semibold font-serif block">
                  {formatPrice(data.gst)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-muted-foreground block">
                  {t("InvoiceTotalAmount")}
                </span>
                <span className="text-xl font-serif font-bold text-red-500  block">
                  {formatPrice(data.total)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tracking & Shiprocket Section */}
        {!loading && data && (
          <div className="mt-6 border rounded-xl border-border p-6 bg-muted">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5" /> Delivery & Tracking
            </h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
              {/* Tracking ID */}
              <div className="bg-card rounded-lg p-3 border">
                <span className="text-xs text-muted-foreground font-medium block mb-1">
                  Tracking ID
                </span>
                {data.trackingId ? (
                  <span className="text-sm font-mono font-bold text-primary">
                    {data.trackingId}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    Will be generated on status update
                  </span>
                )}
              </div>

              {/* Shiprocket Order ID */}
              <div className="bg-card rounded-lg p-3 border">
                <span className="text-xs text-muted-foreground font-medium block mb-1">
                  Shiprocket Order ID
                </span>
                {data.shiprocket?.orderId ? (
                  <span className="text-sm font-mono font-medium">
                    {data.shiprocket.orderId}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    Not pushed yet
                  </span>
                )}
              </div>

              {/* AWB / Status */}
              <div className="bg-card rounded-lg p-3 border">
                <span className="text-xs text-muted-foreground font-medium block mb-1">
                  AWB / Status
                </span>
                {data.shiprocket?.awb || data.shiprocket?.orderId ? (
                  <div>
                    {data.shiprocket?.awb ? (
                      <span className="text-sm font-mono font-medium">
                        {data.shiprocket.awb}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Pushed to SR
                      </span>
                    )}
                    <span className="block text-xs text-muted-foreground">
                      SR: {(data.shiprocket.status || "created")
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Order: <span className="font-medium capitalize">{data.status}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleRefreshShiprocket}
                      disabled={refreshingShiprocket}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium cursor-pointer disabled:opacity-50"
                    >
                      {refreshingShiprocket ? (
                        <>
                          <span className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="h-3 w-3">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                          </svg>
                          Refresh Status
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    —
                  </span>
                )}
              </div>

              {/* Track Action */}
              <div className="bg-card rounded-lg p-3 border">
                <span className="text-xs text-muted-foreground font-medium block mb-1">
                  Tracking
                </span>
                {data.shiprocket?.awb ? (
                  <a
                    href={`https://shiprocket.co/tracking/${data.shiprocket.awb}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                  >
                    Track on Shiprocket
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : data.shiprocket?.orderId ? (
                  <a
                    href={`https://shiprocket.co/tracking/order/${data.shiprocket.orderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                  >
                    Track on Shiprocket
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    —
                  </span>
                )}
              </div>
            </div>

            {/* Push to Shiprocket */}
            {/* {!data.shiprocket?.orderId &&
              data.status !== "delivered" &&
              data.status !== "cancel" && (
                <div className="bg-card rounded-lg p-4 border">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Send className="h-4 w-4" /> Push to ShipRocket
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handlePushToShiprocket}
                      disabled={pushingToShiprocket}
                    >
                      {pushingToShiprocket ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                          Pushing...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Push to ShipRocket
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )} */}

            {/* Payment & Refund Section */}
            {data.paymentMethod === "RazorPay" && (
              <div className="bg-card rounded-lg p-4 border mt-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" /> Payment & Refund
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                  <div className="bg-muted rounded-lg p-3">
                    <span className="text-xs text-muted-foreground font-medium block mb-1">Payment Method</span>
                    <span className="text-sm font-semibold">{data.paymentMethod}</span>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <span className="text-xs text-muted-foreground font-medium block mb-1">Payment Status</span>
                    <span className={`text-sm font-semibold capitalize ${data.paymentStatus === "refunded" ? "text-red-500" : data.paymentStatus === "captured" ? "text-green-500" : ""}`}>
                      {data.paymentStatus || "N/A"}
                    </span>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <span className="text-xs text-muted-foreground font-medium block mb-1">Razorpay Payment ID</span>
                    <span className="text-xs font-mono break-all">{data.razorpay?.razorpayPaymentId || "N/A"}</span>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <span className="text-xs text-muted-foreground font-medium block mb-1">Amount</span>
                    <span className="text-sm font-semibold">{formatPrice(data.total)}</span>
                  </div>
                </div>
                {data.paymentStatus === "captured" && adminInfo?.role !== "delivery-boy" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      const reason = window.prompt("Enter refund reason (optional):");
                      try {
                        await OrderServices.processRefund(id, { reason: reason || "Admin initiated refund" });
                        notifySuccess("Refund processed successfully!");
                        window.location.reload();
                      } catch (err) {
                        notifyError(err?.response?.data?.message || err?.message);
                      }
                    }}
                  >
                    Refund Order
                  </Button>
                )}
                {data.refundInfo?.razorpayRefundId && (
                  <div className="mt-3 bg-muted rounded-lg p-3">
                    <span className="text-xs text-muted-foreground font-medium block mb-1">Refund Details</span>
                    <p className="text-xs">Refund ID: {data.refundInfo.razorpayRefundId}</p>
                    <p className="text-xs">Amount: {formatPrice(data.refundInfo.amount)}</p>
                    <p className="text-xs">Reason: {data.refundInfo.reason}</p>
                    <p className="text-xs">Status: {data.refundInfo.status}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>
      {!loading && !error && (
        <div className="mb-4 mt-3 flex md:flex-row flex-col items-center justify-between">
          <PDFDownloadLink
            document={
              <InvoiceForDownload data={data} globalSetting={globalSetting} />
            }
            fileName="Invoice"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                "Loading..."
              ) : (
                <Button variant="download">
                  Download Invoice
                  <span className="ml-2 text-base">
                    <IoCloudDownloadOutline />
                  </span>
                </Button>
              )
            }
          </PDFDownloadLink>

          <div className="flex md:mt-0 mt-3 gap-4 md:w-auto w-full">
            {globalSetting?.email_to_customer &&
              adminInfo?.role !== "delivery-boy" && (
                <div className="flex justify-end md:w-auto w-full">
                  {isSubmitting ? (
                    <Button disabled={true} type="button">
                      <img
                        src={spinnerLoadingImage}
                        alt="Loading"
                        width={20}
                        height={10}
                      />{" "}
                      <span className="font-serif ml-2 font-light">
                        {" "}
                        Processing
                      </span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEmailInvoice(data)}
                      variant="create"
                    >
                      Email Invoice
                      <span className="ml-2">
                        <FiMail />
                      </span>
                    </Button>
                  )}
                </div>
              )}

            <div className="md:w-auto w-full">
              <Button onClick={handlePrint} variant="import">
                {t("PrintInvoice")}{" "}
                <span className="ml-2">
                  <FiPrinter />
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderInvoice;
