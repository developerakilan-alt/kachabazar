import { Badge } from "@/components/ui/badge";
import { CustomPagination as Pagination } from "@/components/ui/pagination";
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
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
//internal import

import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import useProductSubmit from "@/hooks/useProductSubmit";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import ProductServices from "@/services/ProductServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import AttributeList from "@/components/attribute/AttributeList";
import MainDrawer from "@/components/drawer/MainDrawer";
import ProductDrawer from "@/components/drawer/ProductDrawer";
import Loading from "@/components/preloader/Loading";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { handleUpdate } = useToggleDrawer();
  const { attribue } = useProductSubmit(id);
  const [variantTitle, setVariantTitle] = useState([]);
  const { lang } = useContext(SidebarContext);

  const { data, loading } = useAsync(() => ProductServices.getProductById(id));

  const { currency, showingTranslateValue, formatPrice } = useUtilsFunction();

  const { handleChangePage, totalResults, resultsPerPage, dataTable } =
    useFilter(data?.variants);

  useEffect(() => {
    if (!loading && data?.variants) {
      const res = Object.keys(Object.assign({}, ...data?.variants));

      const varTitle = attribue?.filter((att) =>
        res.includes(att._id),
      );

      setVariantTitle(varTitle);
    }
  }, [attribue, data?.variants, loading, lang]);

  return (
    <>
      <MainDrawer product>
        <ProductDrawer id={id} />
      </MainDrawer>

      <div className="lg:flex lg:items-center lg:justify-between py-8 gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("ProductDetails")}</PageTitle>
        </div>
      </div>

      {loading ? (
        <Loading loading={loading} />
      ) : (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Image Section */}
            <div className="flex-shrink-0 flex items-center justify-center bg-muted/20 border border-border/40 rounded-xl p-8 w-full lg:w-[400px]">
              {data?.image && data?.image[0] ? (
                <img 
                  src={data?.image[0]} 
                  alt="product" 
                  className="max-h-80 w-auto object-contain rounded-lg drop-shadow-sm transition-transform duration-300 hover:scale-105" 
                />
              ) : (
                <img
                  src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                  alt="product"
                  className="max-h-80 w-auto object-contain opacity-40 grayscale"
                />
              )}
            </div>
            
            {/* Details Section */}
            <div className="flex-1 text-left flex flex-col justify-center">
              
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {showingTranslateValue(data?.title)}
                </h2>
                <div className="ml-4 shrink-0">
                  {data?.status === "show" ? (
                    <Badge variant="success" className="font-semibold text-xs px-3 py-1 shadow-sm">
                      {t("Showing")}
                    </Badge>
                  ) : (
                    <Badge variant="danger" className="font-semibold text-xs px-3 py-1 shadow-sm">
                      {t("Hidden")}
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6 font-medium flex items-center gap-2">
                <span>{t("Sku")}:</span> 
                <span className="text-foreground tracking-wide bg-muted px-2 py-0.5 rounded text-xs">{data?.sku || 'N/A'}</span>
              </p>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
                  {formatPrice(data?.prices?.price)}
                </span>
                {data?.prices?.discount >= 1 && (
                  <del className="text-lg md:text-xl text-muted-foreground/60 font-semibold mb-1">
                    {formatPrice(data?.prices?.originalPrice)}
                  </del>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                {data?.stock <= 0 ? (
                  <Badge variant="danger" className="font-semibold px-3 py-1.5 shadow-sm">
                    {t("StockOut")}
                  </Badge>
                ) : (
                  <Badge className="font-semibold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 px-3 py-1.5 border-0 shadow-none">
                    {t("InStock")}
                  </Badge>
                )}
                <span className="text-sm font-semibold text-muted-foreground bg-muted/50 border border-border/50 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                  {t("Quantity")}: <strong className="text-foreground">{data?.stock}</strong>
                </span>
              </div>

              <div className="prose prose-sm max-w-none text-muted-foreground mb-8">
                <p className="leading-relaxed text-[15px]">
                  {showingTranslateValue(data?.description)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-muted/20 rounded-xl border border-border/40 mb-8">
                <div>
                  <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("Category")}</span>
                  <span className="font-semibold text-foreground text-sm">{showingTranslateValue(data?.category?.name) || 'Uncategorized'}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {data?.tag && Array.isArray(JSON.parse(data?.tag)) ? (
                      JSON.parse(data?.tag).map((t, i) => (
                        <span key={i} className="bg-background border border-border text-foreground px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground italic">-</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-2">
                <Button onClick={() => handleUpdate(id)} className="h-11 px-8 rounded-lg font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                  {t("EditProduct")}
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {data?.isCombination && variantTitle?.length > 0 && !loading && (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8 mb-10">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground">{t("ProductVariantList")}</h3>
          </div>
          <TableContainer className="rounded-lg border border-border/60 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold">{t("SR")}</TableHead>
                  <TableHead className="font-semibold">{t("Image")}</TableHead>
                  <TableHead className="font-semibold">{t("Combination")}</TableHead>
                  <TableHead className="font-semibold">{t("Sku")}</TableHead>
                  <TableHead className="font-semibold">{t("Barcode")}</TableHead>
                  <TableHead className="font-semibold">{t("OrginalPrice")}</TableHead>
                  <TableHead className="font-semibold">{t("SalePrice")}</TableHead>
                  <TableHead className="font-semibold">{t("Quantity")}</TableHead>
                </TableRow>
              </TableHeader>
              <AttributeList
                lang={lang}
                variants={dataTable}
                variantTitle={variantTitle}
              />
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
