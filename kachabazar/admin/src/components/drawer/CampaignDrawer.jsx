import { useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { t } from "i18next";
import { Scrollbars } from "react-custom-scrollbars-2";
import {
  FiSearch,
  FiTrash2,
  FiX,
  FiPercent,
  FiDollarSign,
} from "react-icons/fi";
import debounce from "lodash/debounce";

//internal import
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import useCampaignSubmit from "@/hooks/useCampaignSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";
import SwitchToggle from "@/components/form/switch/SwitchToggle";

const CampaignDrawer = ({ id }) => {
  const {
    register,
    language,
    handleSubmit,
    onSubmit,
    errors,
    watch,
    setValue,
    setImageUrl,
    imageUrl,
    published,
    setPublished,
    isFeatured,
    setIsFeatured,
    currency,
    isSubmitting,
    handleSelectLanguage,
    generateSlug,
    // Campaign products
    campaignProducts,
    productSearchText,
    setProductSearchText,
    searchResults,
    searchLoading,
    searchProducts,
    addProductToCampaign,
    removeProductFromCampaign,
    updateCampaignProduct,
    showingTranslateValue,
  } = useCampaignSubmit(id);

  const titleValue = watch("title");
  const slugValue = watch("slug");

  // Auto-generate slug when title changes (only for new campaigns)
  useEffect(() => {
    if (titleValue && !id) {
      const autoSlug = generateSlug(titleValue);
      if (
        !slugValue ||
        slugValue === generateSlug(titleValue.slice(0, -1)) ||
        slugValue === ""
      ) {
        setValue("slug", autoSlug);
      }
    }
  }, [titleValue, id, generateSlug, setValue, slugValue]);

  // Debounced product search
  const debouncedSearch = useCallback(
    debounce((text) => {
      searchProducts(text);
    }, 400),
    [searchProducts],
  );

  useEffect(() => {
    debouncedSearch(productSearchText);
    return () => debouncedSearch.cancel();
  }, [productSearchText, debouncedSearch]);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full relative p-6 border-b bg-muted">
        {id ? (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateCampaign")}
            description={t("UpdateCampaignDescription")}
          />
        ) : (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddCampaign")}
            description={t("AddCampaignDescription")}
          />
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <Scrollbars className="flex-1 mb-8">
          <div className="px-6 pt-8 pb-6 flex-grow scrollbar-hide w-full max-h-full">
            {/* Campaign Banner Image */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Campaign Banner" />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  folder="campaign"
                  targetWidth={1200}
                  targetHeight={400}
                />
              </div>
            </div>

            {/* Campaign Name */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Campaign Name" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Campaign title"
                  name="title"
                  type="text"
                  placeholder="Enter campaign name"
                />
                <Error errorName={errors.title} />
              </div>
            </div>

            {/* Campaign Description */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Description" />
              <div className="col-span-8 sm:col-span-4">
                <textarea
                  {...register("description")}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Campaign description"
                  rows={3}
                />
              </div>
            </div>

            {/* Campaign Slug */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Slug" />
              <div className="col-span-8 sm:col-span-4">
                <div className="flex gap-2">
                  <Input
                    {...register("slug", {
                      pattern: {
                        value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                        message:
                          "Slug must be lowercase alphanumeric with hyphens",
                      },
                    })}
                    type="text"
                    placeholder="auto-generated-from-title"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (titleValue) {
                        const event = {
                          target: {
                            name: "slug",
                            value: generateSlug(titleValue),
                          },
                        };
                        register("slug").onChange(event);
                      }
                    }}
                  >
                    Generate
                  </Button>
                </div>
                <Error errorName={errors.slug} />
              </div>
            </div>

            {/* Start Time */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Start Time" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  {...register("startTime", {
                    required: "Start time is required",
                  })}
                  type="datetime-local"
                  placeholder="Campaign Start Time"
                />
                <Error errorName={errors.startTime} />
              </div>
            </div>

            {/* End Time */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="End Time" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  {...register("endTime", {
                    required: "End time is required",
                  })}
                  type="datetime-local"
                  placeholder="Campaign End Time"
                />
                <Error errorName={errors.endTime} />
              </div>
            </div>

            {/* Show Section */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Display Section" />
              <div className="col-span-8 sm:col-span-4">
                <select
                  {...register("showSection")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="home_top">Home - Top</option>
                  <option value="home_middle">Home - Middle</option>
                  <option value="home_bottom">Home - Bottom</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="none">None (Flash Sale Only)</option>
                </select>
              </div>
            </div>

            {/* Featured on Home Page */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Show on Home Page" />
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle
                  handleProcess={setIsFeatured}
                  processOption={isFeatured}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enable to display this campaign on the store home page. Only
                  one campaign can be featured at a time.
                </p>
              </div>
            </div>

            {/* Published */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("Published")} />
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle
                  handleProcess={setPublished}
                  processOption={published}
                />
              </div>
            </div>

            {/* ─── Campaign Products Section ─── */}
            <div className="border-t border-border pt-6 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Campaign Products
              </h3>

              {/* Product Search */}
              <div className="mb-4 relative">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      value={productSearchText}
                      onChange={(e) => setProductSearchText(e.target.value)}
                      placeholder="Search products to add..."
                      className="pl-9"
                    />
                    {productSearchText && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setProductSearchText("");
                        }}
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((product) => (
                      <button
                        key={product._id}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-3 border-b border-border/50 last:border-0"
                        onClick={() => addProductToCampaign(product)}
                      >
                        <img
                          src={
                            product.image?.[0] ||
                            "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                          }
                          alt=""
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {showingTranslateValue(product.title)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Price: {currency}
                            {product.prices?.price} • Stock: {product.stock}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchLoading && (
                  <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg p-4 text-center text-sm text-muted-foreground">
                    Searching products...
                  </div>
                )}
              </div>

              {/* Campaign Products List - Table Format */}
              {campaignProducts.length > 0 ? (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left p-3 text-xs font-medium text-muted-foreground whitespace-nowrap">
                            Product
                          </th>
                          <th className="text-center p-3 text-xs font-medium text-muted-foreground whitespace-nowrap">
                            Discount
                          </th>
                          <th className="text-center p-3 text-xs font-medium text-muted-foreground whitespace-nowrap">
                            Campaign Price
                          </th>
                          <th className="text-center p-3 text-xs font-medium text-muted-foreground whitespace-nowrap">
                            Stock Limit
                          </th>
                          <th className="text-center p-3 text-xs font-medium text-muted-foreground w-8"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaignProducts.map((cp, index) => {
                          const product = cp.product;
                          const productTitle = product?.title
                            ? showingTranslateValue(product.title)
                            : "Product";
                          const availableStock = product?.stock ?? "N/A";
                          const remaining = cp.stockLimit - (cp.soldCount || 0);
                          const soldPercent =
                            cp.stockLimit > 0
                              ? Math.round(
                                  ((cp.soldCount || 0) / cp.stockLimit) * 100,
                                )
                              : 0;

                          return (
                            <tr
                              key={index}
                              className="border-b border-border/50 last:border-0 hover:bg-muted/30"
                            >
                              {/* Product Info */}
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={
                                      product?.image?.[0] ||
                                      "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                                    }
                                    alt=""
                                    className="h-10 w-10 rounded object-cover flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate max-w-[140px]">
                                      {productTitle}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {currency}
                                      {cp.originalPrice} • Stock:{" "}
                                      <span
                                        className={
                                          typeof availableStock === "number" &&
                                          availableStock < 10
                                            ? "text-destructive font-medium"
                                            : ""
                                        }
                                      >
                                        {availableStock}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Discount - Switch + Value */}
                              <td className="p-3">
                                <div className="flex flex-col items-center gap-1.5">
                                  {/* Discount Type Switch */}
                                  <div className="flex items-center gap-1.5 text-xs">
                                    <span
                                      className={
                                        cp.discountType === "fixed"
                                          ? "font-semibold text-foreground"
                                          : "text-muted-foreground"
                                      }
                                    >
                                      {currency}
                                    </span>
                                    <Switch
                                      checked={cp.discountType === "percentage"}
                                      onCheckedChange={(checked) =>
                                        updateCampaignProduct(
                                          index,
                                          "discountType",
                                          checked ? "percentage" : "fixed",
                                        )
                                      }
                                      className="h-4 w-8 [&>span]:h-3 [&>span]:w-3"
                                    />
                                    <span
                                      className={
                                        cp.discountType === "percentage"
                                          ? "font-semibold text-foreground"
                                          : "text-muted-foreground"
                                      }
                                    >
                                      %
                                    </span>
                                  </div>
                                  {/* Discount Value */}
                                  <div className="flex items-center">
                                    <span className="inline-flex items-center px-1.5 rounded-l border border-r-0 border-input bg-muted text-muted-foreground text-[10px] h-7">
                                      {cp.discountType === "percentage" ? (
                                        <FiPercent className="h-3 w-3" />
                                      ) : (
                                        <FiDollarSign className="h-3 w-3" />
                                      )}
                                    </span>
                                    <Input
                                      type="number"
                                      value={cp.discountValue}
                                      onChange={(e) =>
                                        updateCampaignProduct(
                                          index,
                                          "discountValue",
                                          e.target.value,
                                        )
                                      }
                                      min={0}
                                      max={
                                        cp.discountType === "percentage"
                                          ? 99
                                          : cp.originalPrice
                                      }
                                      step={0.01}
                                      className="h-7 w-16 rounded-l-none text-xs"
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* Campaign Price */}
                              <td className="p-3">
                                <div className="flex items-center justify-center">
                                  <span className="inline-flex items-center px-1.5 rounded-l border border-r-0 border-input bg-muted text-muted-foreground text-[10px] h-7">
                                    {currency}
                                  </span>
                                  <Input
                                    type="number"
                                    value={cp.campaignPrice}
                                    onChange={(e) =>
                                      updateCampaignProduct(
                                        index,
                                        "campaignPrice",
                                        e.target.value,
                                      )
                                    }
                                    min={0}
                                    max={cp.originalPrice}
                                    step={0.01}
                                    className="h-7 w-20 rounded-l-none text-xs font-semibold text-primary"
                                  />
                                </div>
                              </td>

                              {/* Stock Limit */}
                              <td className="p-3">
                                <div className="flex flex-col items-center gap-1">
                                  <Input
                                    type="number"
                                    value={cp.stockLimit}
                                    onChange={(e) =>
                                      updateCampaignProduct(
                                        index,
                                        "stockLimit",
                                        parseInt(e.target.value) || 1,
                                      )
                                    }
                                    min={1}
                                    max={
                                      typeof availableStock === "number"
                                        ? availableStock
                                        : 9999
                                    }
                                    className="h-7 w-16 text-xs text-center"
                                  />
                                  {typeof availableStock === "number" && (
                                    <span className="text-[10px] text-muted-foreground">
                                      of {availableStock}
                                    </span>
                                  )}
                                  {/* Mini progress bar for sold items */}
                                  {cp.soldCount > 0 && (
                                    <div className="w-full">
                                      <div className="w-14 bg-muted rounded-full h-1 mx-auto">
                                        <div
                                          className={`h-1 rounded-full ${
                                            soldPercent >= 90
                                              ? "bg-destructive"
                                              : soldPercent >= 60
                                                ? "bg-orange-500"
                                                : "bg-primary"
                                          }`}
                                          style={{
                                            width: `${soldPercent}%`,
                                          }}
                                        />
                                      </div>
                                      <span className="text-[10px] text-muted-foreground">
                                        {cp.soldCount} sold
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Delete */}
                              <td className="p-3">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                  onClick={() =>
                                    removeProductFromCampaign(index)
                                  }
                                >
                                  <FiTrash2 className="h-3.5 w-3.5" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                  <p className="text-sm">No products added yet</p>
                  <p className="text-xs mt-1">
                    Search and add products to this campaign
                  </p>
                </div>
              )}

              {/* Products Count */}
              {campaignProducts.length > 0 && (
                <div className="mt-3 text-xs text-muted-foreground">
                  {campaignProducts.length} product(s) added to campaign
                </div>
              )}
            </div>
          </div>
        </Scrollbars>

        <DrawerButton id={id} title="Campaign" isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default CampaignDrawer;
