import ReactTagInput from "@pathofdev/react-tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import Select from "react-select";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";

//internal import

import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useTheme } from "@/context/ThemeContext";
import LabelArea from "@/components/form/selectOption/LabelArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import InputValue from "@/components/form/input/InputValue";
import useProductSubmit from "@/hooks/useProductSubmit";
import ActiveButton from "@/components/form/button/ActiveButton";
import InputValueFive from "@/components/form/input/InputValueFive";
import Uploader from "@/components/image-uploader/Uploader";
import ParentCategory from "@/components/category/ParentCategory";
import UploaderThree from "@/components/image-uploader/UploaderThree";
import AttributeOptionTwo from "@/components/attribute/AttributeOptionTwo";
import AttributeListTable from "@/components/attribute/AttributeListTable";
import SwitchToggleForCombination from "@/components/form/switch/SwitchToggleForCombination";

//internal import

const ProductDrawer = ({ id }) => {
  const { t } = useTranslation();

  const {
    tag,
    setTag,
    values,
    language,
    register,
    onSubmit,
    errors,
    slug,
    openModal,
    attribue,
    setValues,
    variants,
    imageUrl,
    setImageUrl,
    handleSubmit,
    isCombination,
    variantTitle,
    attributes,
    attTitle,
    handleAddAtt,
    // productId,
    onCloseModal,
    isBulkUpdate,
    globalSetting,
    isSubmitting,
    tapValue,
    setTapValue,
    resetRefTwo,
    handleSkuBarcode,
    handleProductTap,
    selectedCategory,
    setSelectedCategory,
    setDefaultCategory,
    defaultCategory,
    handleProductSlug,
    handleSelectLanguage,
    handleIsCombination,
    handleEditVariant,
    handleRemoveVariant,
    handleClearVariant,
    handleQuantityPrice,
    handleSelectImage,
    handleSelectInlineImage,
    handleGenerateCombination,
    handleSalePriceFocus,
    seoMetaKeywords,
    setSeoMetaKeywords,
    seoOgImage,
    setSeoOgImage,
  } = useProductSubmit(id);

  const { currency, showingTranslateValue } = useUtilsFunction();
  const { theme } = useTheme();

  return (
    <div className="flex flex-col h-full">
      <Modal
        open={openModal}
        onClose={onCloseModal}
        center
        closeIcon={
          <div className="absolute top-0 right-0 text-red-500  active:outline-none text-xl border-0">
            <FiX className="text-3xl" />
          </div>
        }
      >
        <div className="cursor-pointer">
          <UploaderThree
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            handleSelectImage={handleSelectImage}
          />
        </div>
      </Modal>

      <div className="w-full relative px-6 py-4 border-b bg-muted">
        {id ? (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateProduct")}
            description={t("UpdateProductDescription")}
          />
        ) : (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("DrawerAddProduct")}
            description={t("AddProductDescription")}
          />
        )}
      </div>

      <div className="flex items-center justify-between h-12 px-4 flex-wrap text-sm font-medium text-center text-muted-foreground border-b">
        <ul className="flex items-center">
          <li className="mr-2">
            <ActiveButton
              tapValue={tapValue}
              activeValue="Basic Info"
              handleProductTap={handleProductTap}
            />
          </li>
          {isCombination && (
            <li className="mr-2">
              <ActiveButton
                tapValue={tapValue}
                activeValue="Combination"
                handleProductTap={handleProductTap}
              />
            </li>
          )}
          <li className="mr-2">
            <ActiveButton
              tapValue={tapValue}
              activeValue="SEO"
              handleProductTap={handleProductTap}
            />
          </li>
        </ul>
        <div className="flex items-center">
          <SwitchToggleForCombination
            product
            handleProcess={handleIsCombination}
            processOption={isCombination}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
        id="block"
      >
        <Scrollbars className="flex-1 mb-8">
          {tapValue === "Basic Info" && (
            <div className="px-6 pt-8 pb-6 flex-grow w-full h-full max-h-full">
              {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductID")} />
                <div className="col-span-8 sm:col-span-4">{productId}</div>
              </div> */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductTitleName")} />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    {...register(`title`, {
                      required: "TItle is required!",
                    })}
                    name="title"
                    type="text"
                    placeholder={t("ProductTitleName")}
                    onBlur={(e) => handleProductSlug(e.target.value)}
                  />
                  <Error errorName={errors.title} />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductDescription")} />
                <div className="col-span-8 sm:col-span-4">
                  <Textarea
                    className="border text-sm block w-full bg-background border-input text-foreground placeholder:text-muted-foreground"
                    {...register("description", {
                      required: false,
                    })}
                    name="description"
                    placeholder={t("ProductDescription")}
                    rows="4"
                    spellCheck="false"
                  />
                  <Error errorName={errors.description} />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductImage")} />
                <div className="col-span-8 sm:col-span-4">
                  <Uploader
                    product
                    folder="product"
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductSKU")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label={t("ProductSKU")}
                    name="sku"
                    type="text"
                    placeholder={t("ProductSKU")}
                  />
                  <Error errorName={errors.sku} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductBarcode")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label={t("ProductBarcode")}
                    name="barcode"
                    type="text"
                    placeholder={t("ProductBarcode")}
                  />
                  <Error errorName={errors.barcode} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("Category")} />
                <div className="col-span-8 sm:col-span-4">
                  <ParentCategory
                    lang={language}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    setDefaultCategory={setDefaultCategory}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("DefaultCategory")} />
                <div className="col-span-8 sm:col-span-4">
                  <Select
                    value={defaultCategory?.map((cat) => ({
                      value: cat._id,
                      label: showingTranslateValue(cat.name),
                      ...cat,
                    }))}
                    onChange={(selectedOption) => {
                      const category = selectedOption
                        ? [
                            {
                              _id: selectedOption._id,
                              name: selectedOption.name,
                            },
                          ]
                        : [];
                      setDefaultCategory(category);
                    }}
                    options={selectedCategory?.map((cat) => ({
                      value: cat._id,
                      label: showingTranslateValue(cat.name),
                      ...cat,
                    }))}
                    placeholder="Default Category"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isClearable
                    theme={(selectTheme) => ({
                      ...selectTheme,
                      colors: {
                        ...selectTheme.colors,
                        primary: theme === "dark" ? "#374151" : "#3b82f6",
                        primary25: theme === "dark" ? "#1f2937" : "#dbeafe",
                        neutral0: theme === "dark" ? "#1f2937" : "#ffffff",
                        neutral80: theme === "dark" ? "#e5e7eb" : "#1f2937",
                      },
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Product Price" />
                <div className="col-span-8 sm:col-span-4">
                  <InputValue
                    disabled={isCombination}
                    register={register}
                    maxValue={20000000000}
                    minValue={1}
                    label="Original Price"
                    name="originalPrice"
                    type="number"
                    placeholder="OriginalPrice"
                    defaultValue={0.0}
                    required={true}
                    product
                    currency={currency}
                  />
                  <Error errorName={errors.originalPrice} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("SalePrice")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputValue
                    disabled={isCombination}
                    product
                    register={register}
                    minValue={0}
                    defaultValue={0.0}
                    required={true}
                    label="Sale price"
                    name="price"
                    type="number"
                    placeholder="Sale price"
                    currency={currency}
                    onFocus={handleSalePriceFocus}
                  />
                  <Error errorName={errors.price} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                <LabelArea label={t("ProductQuantity")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputValueFive
                    required={true}
                    disabled={isCombination}
                    register={register}
                    minValue={0}
                    defaultValue={0}
                    label="Quantity"
                    name="stock"
                    type="number"
                    placeholder={t("ProductQuantity")}
                  />
                  <Error errorName={errors.stock} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductSlug")} />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    {...register(`slug`, {
                      required: "slug is required!",
                    })}
                    className=" mr-2 p-2"
                    name="slug"
                    type="text"
                    defaultValue={slug}
                    placeholder={t("ProductSlug")}
                    onBlur={(e) => handleProductSlug(e.target.value)}
                  />
                  <Error errorName={errors.slug} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductTag")} />
                <div className="col-span-8 sm:col-span-4">
                  <ReactTagInput
                    placeholder={t("ProductTagPlaseholder")}
                    tags={tag}
                    onChange={(newTags) => setTag(newTags)}
                  />
                </div>
              </div>
            </div>
          )}

          {tapValue === "Combination" &&
            isCombination &&
            (attribue.length < 1 ? (
              <div
                className="bg-primary/10 border border-primary rounded-md text-primary px-4 py-3 m-4"
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-primary mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm">
                      {t("AddCombinationsDiscription")}{" "}
                      <Link to="/attributes" className="font-bold">
                        {t("AttributesFeatures")}
                      </Link>
                      {t("AddCombinationsDiscriptionTwo")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-8 w-full md:w-3/4 lg:w-1/2">
                  <h4 className="block text-sm font-semibold text-muted-foreground mb-2">
                    {t("SelectAttribute")}
                  </h4>
                  <Select
                    isMulti
                    options={attTitle}
                    value={attributes?.map((att) => ({
                      label: showingTranslateValue(att?.title),
                      value: showingTranslateValue(att?.title),
                      ...att,
                    }))}
                    onChange={(selected) => {
                      const mapped =
                        selected?.map((s) => ({
                          ...s,
                          _id: s._id || s.value,
                          title: s.title || { en: s.label },
                        })) || [];
                      handleAddAtt(mapped);
                    }}
                    placeholder={t("SelectAttribute")}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    theme={(selectTheme) => ({
                      ...selectTheme,
                      colors: {
                        ...selectTheme.colors,
                        primary: theme === "dark" ? "#374151" : "#3b82f6",
                        primary25: theme === "dark" ? "#1f2937" : "#dbeafe",
                        neutral0: theme === "dark" ? "#1f2937" : "#ffffff",
                        neutral80: theme === "dark" ? "#e5e7eb" : "#1f2937",
                      },
                    })}
                  />
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mb-8">
                  {attributes?.map((attribute, i) => (
                    <div
                      key={attribute._id}
                      className="bg-card border border-border rounded-lg shadow-sm"
                    >
                      <div className="flex w-full items-center justify-between font-sans bg-muted/30 border-b border-border/60 px-4 py-3 text-left text-sm font-semibold text-foreground rounded-t-lg">
                        <span>
                          {t("Select")}{" "}
                          {showingTranslateValue(attribute?.title)}
                        </span>
                      </div>
                      <div className="p-4">
                        <AttributeOptionTwo
                          id={i + 1}
                          values={values}
                          lang={language}
                          attributes={attribute}
                          setValues={setValues}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 mb-4">
                  {variantTitle.length > 0 && (
                    <Button
                      onClick={handleClearVariant}
                      variant="outline"
                      className="h-10 px-6 font-semibold"
                    >
                      {t("ClearVariants")}
                    </Button>
                  )}

                  {attributes?.length > 0 && (
                    <Button
                      onClick={handleGenerateCombination}
                      type="button"
                      className="h-10 px-6 font-semibold"
                    >
                      {t("GenerateVariants")}
                    </Button>
                  )}
                </div>
              </div>
            ))}

          {tapValue === "Combination" &&
            isCombination &&
            variantTitle.length > 0 && (
              <div className="px-6 overflow-x-auto">
                {/* {variants?.length >= 0 && ( */}
                {isCombination && (
                  <TableContainer className="rounded-b-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("Image")}</TableHead>
                          <TableHead>{t("Combination")}</TableHead>
                          <TableHead>{t("Sku")}</TableHead>
                          <TableHead>{t("Barcode")}</TableHead>
                          <TableHead>{t("Price")}</TableHead>
                          <TableHead>{t("SalePrice")}</TableHead>
                          <TableHead>{t("QuantityTbl")}</TableHead>
                          <TableHead className="text-right">
                            {t("Action")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <AttributeListTable
                        lang={language}
                        variants={variants}
                        setTapValue={setTapValue}
                        variantTitle={variantTitle}
                        isBulkUpdate={isBulkUpdate}
                        handleSkuBarcode={handleSkuBarcode}
                        handleEditVariant={handleEditVariant}
                        handleRemoveVariant={handleRemoveVariant}
                        handleQuantityPrice={handleQuantityPrice}
                        handleSelectInlineImage={handleSelectInlineImage}
                      />
                    </Table>
                  </TableContainer>
                )}
              </div>
            )}

          {tapValue === "SEO" && (
            <div className="px-6 pt-8 pb-6 flex-grow w-full h-full max-h-full">
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Meta Title" />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    {...register("seoMetaTitle")}
                    type="text"
                    placeholder="Custom SEO title (leave empty to use product title)"
                    className="border h-12 text-sm focus:outline-none block w-full bg-muted border-transparent focus:bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Meta Description" />
                <div className="col-span-8 sm:col-span-4">
                  <Textarea
                    {...register("seoMetaDescription")}
                    placeholder="Custom SEO description (leave empty to use product description)"
                    className="border text-sm focus:outline-none block w-full bg-muted border-transparent focus:bg-background"
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="SEO Keywords" />
                <div className="col-span-8 sm:col-span-4">
                  <ReactTagInput
                    placeholder="Type and press enter to add SEO keywords"
                    tags={seoMetaKeywords}
                    onChange={(newTags) => setSeoMetaKeywords(newTags)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="OG Image URL" />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    type="text"
                    value={seoOgImage}
                    onChange={(e) => setSeoOgImage(e.target.value)}
                    placeholder="Open Graph image URL (leave empty to use product image)"
                    className="border h-12 text-sm focus:outline-none block w-full bg-muted border-transparent focus:bg-background"
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg border">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  SEO Preview
                </h4>
                <p className="text-blue-600 text-base font-medium truncate">
                  {register("seoMetaTitle")?.value ||
                    register("title")?.value ||
                    "Product Title"}
                </p>
                <p className="text-green-700 text-sm truncate">
                  yourstore.com/product/...
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {register("seoMetaDescription")?.value ||
                    register("description")?.value ||
                    "Product description will appear here..."}
                </p>
              </div>
            </div>
          )}
        </Scrollbars>

        <DrawerButton id={id} title="Product" isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default React.memo(ProductDrawer);
