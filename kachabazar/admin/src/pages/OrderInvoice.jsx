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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Truck, MapPin, Star, Package } from "lucide-react";

//internal import
import useAsync from "@/hooks/useAsync";
import useError from "@/hooks/useError";
import Status from "@/components/table/Status";
import { notifyError, notifySuccess } from "@/utils/toast";
import { AdminContext } from "@/context/AdminContext";
import OrderServices from "@/services/OrderServices";
import DeliveryBoyServices from "@/services/DeliveryBoyServices";
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

  // Delivery boy assignment
  const queryClient = useQueryClient();
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: deliveryBoysData } = useQuery({
    queryKey: ["available-delivery-boys"],
    queryFn: () =>
      DeliveryBoyServices.getAllDeliveryBoys({
        status: "active",
        page: 1,
        limit: 100,
      }),
  });

  const availableDeliveryBoys = deliveryBoysData?.deliveryBoys || [];

  const handleAssignDeliveryBoy = async () => {
    if (!selectedDeliveryBoy) {
      return notifyError("Please select a delivery boy!");
    }
    try {
      setIsAssigning(true);
      const res = await DeliveryBoyServices.assignDeliveryBoy({
        orderId: id,
        deliveryBoyId: selectedDeliveryBoy,
      });
      notifySuccess(res.message);
      queryClient.invalidateQueries(["available-delivery-boys"]);
      // Refresh order data
      window.location.reload();
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setIsAssigning(false);
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
                    alt="kachabazar"
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

        {/* Tracking & Delivery Boy Section */}
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

              {/* Tracking Status */}
              <div className="bg-card rounded-lg p-3 border">
                <span className="text-xs text-muted-foreground font-medium block mb-1">
                  Tracking Status
                </span>
                <span className="text-sm capitalize font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {data.trackingStatus?.replace(/-/g, " ") || "Order Placed"}
                </span>
              </div>

              {/* Delivery Boy */}
              <div className="bg-card rounded-lg p-3 border">
                <span className="text-xs text-muted-foreground font-medium block mb-1">
                  Delivery Partner
                </span>
                {data.deliveryBoyName ? (
                  <div>
                    <span className="text-sm font-medium">
                      {data.deliveryBoyName}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {data.deliveryBoyPhone}
                    </p>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    Not Assigned
                  </span>
                )}
              </div>

              {/* Estimated/Actual Delivery */}
              <div className="bg-card rounded-lg p-3 border">
                <span className="text-xs text-muted-foreground font-medium block mb-1">
                  {data.deliveredAt ? "Delivered At" : "Est. Delivery"}
                </span>
                <span className="text-sm font-medium">
                  {data.deliveredAt
                    ? showDateFormat(data.deliveredAt)
                    : data.estimatedDeliveryTime
                      ? showDateFormat(data.estimatedDeliveryTime)
                      : "N/A"}
                </span>
              </div>
            </div>

            {/* Assign Delivery Boy */}
            {adminInfo?.role !== "delivery-boy" &&
              !data.deliveryBoy &&
              data.status !== "delivered" &&
              data.status !== "cancel" && (
                <div className="bg-card rounded-lg p-4 border">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" /> Assign Delivery Partner
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:max-w-xs"
                      value={selectedDeliveryBoy}
                      onChange={(e) => setSelectedDeliveryBoy(e.target.value)}
                    >
                      <option value="">Select Delivery Boy</option>
                      {availableDeliveryBoys.map((db) => (
                        <option key={db._id} value={db._id}>
                          {db.name?.en || db.name} - {db.phone} (
                          {db.availability})
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={handleAssignDeliveryBoy}
                      disabled={isAssigning || !selectedDeliveryBoy}
                    >
                      {isAssigning ? "Assigning..." : "Assign"}
                    </Button>
                  </div>
                </div>
              )}

            {/* Delivery Rating */}
            {data.deliveryRating?.rating && (
              <div className="bg-card rounded-lg p-4 border mt-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" /> Delivery Rating
                </h4>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < data.deliveryRating.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm font-medium ml-1">
                    {data.deliveryRating.rating}/5
                  </span>
                </div>
                {data.deliveryRating.review && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    "{data.deliveryRating.review}"
                  </p>
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
