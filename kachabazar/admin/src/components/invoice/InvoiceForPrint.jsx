import dayjs from "dayjs";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card } from "../ui/card";
import { formatPrice as formatPriceFn } from "@/utils/currencyFormat";

const InvoiceForPrint = ({ data, printRef, globalSetting }) => {
  const { t } = useTranslation();

  const currency = globalSetting?.default_currency || "$";
  const fp = (val) => formatPriceFn(val, currency);

  return (
    <div ref={printRef} className="p-4">
      {Array.isArray(data) ? (
        data?.map((or, i) => (
          <div className="mb-8" key={i + 1}>
            {(globalSetting?.invoice_logo || globalSetting?.logo) && (
              <img
                className="flex mx-auto"
                size="large"
                src={globalSetting?.invoice_logo || globalSetting?.logo}
                alt=""
                width={50}
              />
            )}

            <div className="my-1">
              <div className="flex justify-center">
                <h1 className="font-bold text-xl">
                  {globalSetting?.company_name}
                </h1>
              </div>

              <Card className="flex flex-col justify-center text-center">
                <span className="flex-row">{globalSetting?.address}</span>

                <span className="flex justify-center">
                  {globalSetting?.contact}
                </span>

                {globalSetting?.web_site}
                <br />
                {globalSetting?.email}
              </Card>
            </div>

            <TableContainer className="my-4 rounded-b-lg">
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell className="bg-white">
                      <span className="text-xs capitalize text-foreground">
                        {t("Item")}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs bg-card capitalize text-center text-foreground">
                      {t("QTY")}
                    </TableCell>
                    <TableCell className="text-xs bg-card capitalize text-right text-foreground">
                      {t("Amount")}
                    </TableCell>
                  </tr>
                </TableHeader>
                <TableBody className="bg-card divide-y divide-border text-serif text-sm">
                  {or?.cart?.map((item, i) => (
                    <TableRow key={i} className="  bill">
                      <TableCell className="py-1">
                        <span className="font-normal text-muted-foreground bill">
                          {" "}
                          {item.title?.substring(0, 15)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-1">
                        <span className="font-bold text-center bill">
                          {" "}
                          {item.quantity}{" "}
                        </span>
                      </TableCell>

                      <TableCell className="text-right py-1">
                        <span className="text-right font-bold text-foreground bill">
                          {" "}
                          {fp(item.price * item.quantity)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Card>
              <div className="flex justify-between -mt-3 mr-1 mb-4">
                <div className="mt-2">
                  {or?.paymentMethod === "Combined" ? (
                    <p className="bill">
                      <span className="mb-1 font-semibold bill font-serif text-xs text-muted-foreground block">
                        {t("Paymentmethod")} :{" "}
                        <span className="text-muted-foreground bill">
                          {or.paymentMethod}
                        </span>
                      </span>
                      {or?.paymentDetails?.selectPaymentOption_Card !==
                        undefined && (
                        <span className="text-xs bill">
                          {or?.paymentDetails?.selectPaymentOption_Card}:{" "}
                          <span className="font-semibold text-foreground">
                            {" "}
                            {fp(or?.paymentDetails?.paymentAmount_Card)}
                          </span>
                        </span>
                      )}
                      <br />
                      {or?.paymentDetails?.selectPaymentOption_Cash !==
                        undefined && (
                        <span className="text-xs bill">
                          {or?.paymentDetails?.selectPaymentOption_Cash}:{" "}
                          <span className="font-semibold text-foreground">
                            {fp(or?.paymentDetails?.paymentAmount_Cash)}
                          </span>
                        </span>
                      )}
                      <br />
                      {or?.paymentDetails?.selectPaymentOption_Credit !==
                        undefined && (
                        <span className="text-xs bill">
                          {or?.paymentDetails?.selectPaymentOption_Credit}:{" "}
                          <span className="font-semibold text-foreground">
                            {fp(or?.paymentDetails?.paymentAmount_Credit)}
                          </span>
                        </span>
                      )}
                    </p>
                  ) : (
                    <p className="bill">
                      <span className="font-semibold bill font-serif text-xs text-muted-foreground block">
                        {t("Paymentmethod")} :{" "}
                        <span className="text-foreground bill">
                          {or.paymentMethod}
                        </span>
                      </span>
                    </p>
                  )}

                  <div className="text-xs bill">
                    {or?.shippingOption && (
                      <>
                        <span className="text-muted-foreground">
                          {t("ShippingMethodLower")} :
                          <span className="font-semibold text-foreground">
                            {or?.shippingOption}
                          </span>
                        </span>
                        <br />
                      </>
                    )}
                    <span className="text-muted-foreground">
                      {t("NoofItems")} :{" "}
                      <span className="font-semibold text-foreground">
                        {or?.cart?.length}
                      </span>{" "}
                    </span>{" "}
                    <br />
                    <span className="text-muted-foreground">
                      {t("BillNo")} :{" "}
                      <span className="font-semibold text-foreground">
                        {" "}
                        {or?.invoice}
                      </span>{" "}
                    </span>{" "}
                    <br />
                    <br />
                    {globalSetting?.vat_number && (
                      <>
                        <span className="text-muted-foreground">
                          {t("VATNumber")}:{" "}
                          <span className="font-semibold text-foreground">
                            {" "}
                            {globalSetting?.vat_number}
                          </span>{" "}
                        </span>
                        <br />
                      </>
                    )}
                    <span className="text-muted-foreground">
                      {t("Date")} :{" "}
                      <span className="font-semibold text-foreground">
                        {" "}
                        {/* {dayjs(new Date()).format('MMMM D, YYYY h:mm A')} */}
                        {dayjs(new Date()).format("MM/D/YYYY")}
                      </span>{" "}
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <h5 className="flex justify-between font-medium text-xs ">
                    <span>{t("GrossTotal")} :</span>{" "}
                    <span className="font-semibold ">{fp(or?.subTotal)}</span>
                  </h5>

                  {or?.shippingCost > 0 && (
                    <h5 className="flex justify-between font-medium text-xs">
                      <span> {t("ShippingCostLower")} :</span>{" "}
                      <span className="font-semibold ">
                        {fp(or?.shippingCost)}
                      </span>
                    </h5>
                  )}
                  {or?.discount > 0 && (
                    <h5 className="flex justify-between font-medium text-xs">
                      <span> {t("DiscountLower")} :</span>{" "}
                      <span className="font-semibold">{fp(or?.discount)}</span>
                    </h5>
                  )}
                  <h3 className="flex justify-between font-medium text-xs border-t border-black mt-2">
                    <span> {t("Total")} : </span>
                    <span className="font-semibold ">{fp(or?.total)}</span>
                  </h3>
                </div>
              </div>
            </Card>

            <h2 className="mb-2 text-center font-medium text-sm">
              {t("ThankYouMsg")}
            </h2>
          </div>
        ))
      ) : (
        <Fragment>
          {(globalSetting?.invoice_logo || globalSetting?.logo) && (
            <img
              className="flex mx-auto"
              size="large"
              src={globalSetting?.invoice_logo || globalSetting?.logo}
              alt=""
              width={50}
            />
          )}

          <div className="my-1">
            <div className="flex justify-center">
              <h1 className="font-bold text-xl">
                {globalSetting?.company_name}
              </h1>
            </div>

            <Card className="flex flex-col justify-center text-center">
              <span className="flex-row">{globalSetting?.address}</span>

              <span className="flex justify-center">
                {globalSetting?.contact}
              </span>

              {globalSetting?.web_site}
              <br />
              {globalSetting?.email}
            </Card>
          </div>

          <TableContainer className="my-4 rounded-b-lg">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell className="bg-white">
                    <span className="text-xs capitalize text-foreground">
                      {t("Item")}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs bg-card capitalize text-center text-foreground">
                    {t("QTY")}
                  </TableCell>
                  <TableCell className="text-xs bg-card capitalize text-right text-foreground">
                    {t("Amount")}
                  </TableCell>
                </tr>
              </TableHeader>
              <TableBody className="bg-card divide-y divide-border text-serif text-sm">
                {data?.cart?.map((item, i) => (
                  <TableRow key={i} className="  bill">
                    <TableCell className="py-1">
                      <span className="font-normal text-muted-foreground bill">
                        {" "}
                        {item.title?.substring(0, 15)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-1">
                      <span className="font-bold text-center bill">
                        {" "}
                        {item.quantity}{" "}
                      </span>
                    </TableCell>

                    <TableCell className="text-right py-1">
                      <span className="text-right font-bold text-foreground bill">
                        {" "}
                        {fp(item.price * item.quantity)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Card>
            <div className="flex justify-between -mt-3 mr-1 mb-4">
              <div className="mt-2">
                {data?.paymentMethod === "Combined" ? (
                  <p className="bill">
                    <span className="mb-1 font-semibold bill font-serif text-xs text-muted-foreground block">
                      {t("Paymentmethod")} :{" "}
                      <span className="text-muted-foreground bill">
                        {data.paymentMethod}
                      </span>
                    </span>
                    {data?.paymentDetails?.selectPaymentOption_Card !==
                      undefined && (
                      <span className="text-xs bill">
                        {data?.paymentDetails?.selectPaymentOption_Card}:{" "}
                        <span className="font-semibold text-foreground">
                          {" "}
                          {fp(data?.paymentDetails?.paymentAmount_Card)}
                        </span>
                      </span>
                    )}
                    <br />
                    {data?.paymentDetails?.selectPaymentOption_Cash !==
                      undefined && (
                      <span className="text-xs bill">
                        {data?.paymentDetails?.selectPaymentOption_Cash}:{" "}
                        <span className="font-semibold text-foreground">
                          {fp(data?.paymentDetails?.paymentAmount_Cash)}
                        </span>
                      </span>
                    )}
                    <br />
                    {data?.paymentDetails?.selectPaymentOption_Credit !==
                      undefined && (
                      <span className="text-xs bill">
                        {data?.paymentDetails?.selectPaymentOption_Credit}:{" "}
                        <span className="font-semibold text-foreground">
                          {fp(data?.paymentDetails?.paymentAmount_Credit)}
                        </span>
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="bill">
                    <span className="font-semibold bill font-serif text-xs text-muted-foreground block">
                      {t("Paymentmethod")} :{" "}
                      <span className="text-foreground bill">
                        {data.paymentMethod}
                      </span>
                    </span>
                  </p>
                )}

                <div className="text-xs bill">
                  {data?.shippingOption && (
                    <>
                      <span className="text-muted-foreground">
                        {t("ShippingMethodLower")} :
                        <span className="font-semibold text-foreground">
                          {data?.shippingOption}
                        </span>
                      </span>
                      <br />
                    </>
                  )}
                  <span className="text-muted-foreground">
                    {t("NoofItems")} :{" "}
                    <span className="font-semibold text-foreground">
                      {data?.cart?.length}
                    </span>{" "}
                  </span>{" "}
                  <br />
                  <span className="text-muted-foreground">
                    {t("BillNo")} :{" "}
                    <span className="font-semibold text-foreground">
                      {" "}
                      {data?.invoice}
                    </span>{" "}
                  </span>{" "}
                  <br />
                  <br />
                  {globalSetting?.vat_number && (
                    <>
                      <span className="text-muted-foreground">
                        {t("VATNumber")}:{" "}
                        <span className="font-semibold text-foreground">
                          {" "}
                          {globalSetting?.vat_number}
                        </span>{" "}
                      </span>
                      <br />
                    </>
                  )}
                  <span className="text-muted-foreground">
                    {t("Date")} :{" "}
                    <span className="font-semibold text-foreground">
                      {" "}
                      {/* {dayjs(new Date()).format('MMMM D, YYYY h:mm A')} */}
                      {dayjs(new Date()).format("MM/D/YYYY")}
                    </span>{" "}
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <h5 className="flex justify-between font-medium text-xs ">
                  <span>{t("GrossTotal")} :</span>{" "}
                  <span className="font-semibold ">{fp(data?.subTotal)}</span>
                </h5>

                {data?.shippingCost > 0 && (
                  <h5 className="flex justify-between font-medium text-xs">
                    <span> {t("ShippingCostLower")} :</span>{" "}
                    <span className="font-semibold ">
                      {fp(data?.shippingCost)}
                    </span>
                  </h5>
                )}
                {data?.discount > 0 && (
                  <h5 className="flex justify-between font-medium text-xs">
                    <span> {t("DiscountLower")} :</span>{" "}
                    <span className="font-semibold">{fp(data?.discount)}</span>
                  </h5>
                )}
                <h3 className="flex justify-between font-medium text-xs border-t border-black mt-2">
                  <span> {t("Total")} : </span>
                  <span className="font-semibold ">{fp(data?.total)}</span>
                </h3>
              </div>
            </div>
          </Card>

          <h2 className="mb-2 text-center font-medium text-sm">
            {t("ThankYouMsg")}
          </h2>
        </Fragment>
      )}
    </div>
  );
};

export default InvoiceForPrint;
