import dayjs from "dayjs";
import { useContext, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

//internal import
import useUtilsFunction from "./useUtilsFunction";
import { SidebarContext } from "@/context/SidebarContext";
import CampaignServices from "@/services/CampaignServices";
import ProductServices from "@/services/ProductServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import useTranslationValue from "./useTranslationValue";
import { useAction } from "@/context/ActionContext";
import { handleApiValidationErrors } from "@/utils/validation";

const useCampaignSubmit = (id) => {
  const { setIsUpdate, lang } = useContext(SidebarContext);
  const { openDrawer, closeDrawer } = useAction();
  const [imageUrl, setImageUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [resData, setResData] = useState({});
  const [published, setPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Campaign products state
  const [campaignProducts, setCampaignProducts] = useState([]);
  const [productSearchText, setProductSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const { currency, showingTranslateValue } = useUtilsFunction();
  const queryClient = useQueryClient();
  const { handlerTextTranslateHandler } = useTranslationValue();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    watch,
    formState: { errors },
  } = useForm();

  // Search products for adding to campaign
  const searchProducts = useCallback(
    async (searchText) => {
      if (!searchText || searchText.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        setSearchLoading(true);
        const res = await ProductServices.getAllProducts({
          page: 1,
          limit: 20,
          category: "",
          title: searchText,
          price: "",
        });
        // Filter out products already in this campaign
        const existingIds = campaignProducts.map(
          (cp) => cp.product?._id || cp.product,
        );
        const filtered = (res?.products || []).filter(
          (p) => !existingIds.includes(p._id),
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error("Product search error:", err);
      } finally {
        setSearchLoading(false);
      }
    },
    [campaignProducts],
  );

  // Add product to campaign
  const addProductToCampaign = useCallback(
    (product) => {
      const existingIds = campaignProducts.map(
        (cp) => cp.product?._id || cp.product,
      );
      if (existingIds.includes(product._id)) {
        notifyError("Product already added to campaign!");
        return;
      }

      const newCampaignProduct = {
        product: product,
        originalPrice: product.prices?.price || 0,
        campaignPrice: product.prices?.price || 0,
        discountType: "fixed",
        discountValue: 0,
        stockLimit: Math.min(product.stock || 10, 100),
        soldCount: 0,
        isActive: true,
      };

      setCampaignProducts((prev) => [...prev, newCampaignProduct]);
      setSearchResults([]);
      setProductSearchText("");
    },
    [campaignProducts],
  );

  // Remove product from campaign
  const removeProductFromCampaign = useCallback((index) => {
    setCampaignProducts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Update campaign product field
  const updateCampaignProduct = useCallback((index, field, value) => {
    setCampaignProducts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // Auto-calculate campaign price based on discount
      if (field === "discountType" || field === "discountValue") {
        const cp = updated[index];
        const discountType = field === "discountType" ? value : cp.discountType;
        const discountValue =
          field === "discountValue" ? Number(value) : cp.discountValue;
        const originalPrice = cp.originalPrice;

        if (discountType === "percentage") {
          updated[index].campaignPrice =
            Math.round(
              (originalPrice - (originalPrice * discountValue) / 100) * 100,
            ) / 100;
        } else {
          updated[index].campaignPrice = Math.max(
            0,
            Math.round((originalPrice - discountValue) * 100) / 100,
          );
        }
      }

      // If campaign price is changed directly, calculate discount
      if (field === "campaignPrice") {
        const cp = updated[index];
        const campaignPrice = Number(value);
        const originalPrice = cp.originalPrice;
        const diff = originalPrice - campaignPrice;
        if (cp.discountType === "percentage") {
          updated[index].discountValue =
            Math.round((diff / originalPrice) * 10000) / 100;
        } else {
          updated[index].discountValue = Math.max(
            0,
            Math.round(diff * 100) / 100,
          );
        }
      }

      return updated;
    });
  }, []);

  const generateSlug = useCallback((title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const titleTranslates = await handlerTextTranslateHandler(
        data.title,
        language,
        resData?.title,
      );

      const descTranslates = await handlerTextTranslateHandler(
        data.description || "",
        language,
        resData?.description,
      );

      // Prepare products for API
      const productsPayload = campaignProducts.map((cp) => ({
        product: cp.product?._id || cp.product,
        campaignPrice: Number(cp.campaignPrice),
        originalPrice: Number(cp.originalPrice),
        discountType: cp.discountType,
        discountValue: Number(cp.discountValue),
        stockLimit: Number(cp.stockLimit),
        soldCount: cp.soldCount || 0,
        isActive: cp.isActive !== false,
      }));

      const campaignData = {
        title: {
          ...titleTranslates,
          [language]: data.title,
        },
        description: {
          ...descTranslates,
          [language]: data.description || "",
        },
        slug: data.slug || generateSlug(data.title),
        banner: imageUrl,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        showSection: data.showSection || "home_middle",
        isFeatured,
        products: productsPayload,
        status: published ? "show" : "hide",
      };

      if (id) {
        const res = await CampaignServices.updateCampaign(id, campaignData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        queryClient.invalidateQueries(["campaigns"]);
      } else {
        const res = await CampaignServices.addCampaign(campaignData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        queryClient.invalidateQueries(["campaigns"]);
      }
    } catch (err) {
      setIsSubmitting(false);
      // Handle validation errors from API and set field-level errors
      handleApiValidationErrors(err, setError, notifyError);
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("title", resData.title[lang ? lang : "en"]);
      setValue("description", resData.description?.[lang ? lang : "en"] || "");
    }
  };

  // Reset form on close
  useEffect(() => {
    if (!id) {
      setResData({});
      setValue("title", "");
      setValue("description", "");
      setValue("slug", "");
      setValue("startTime", "");
      setValue("endTime", "");
      setValue("showSection", "home_middle");
      setImageUrl("");
      setPublished(true);
      setIsFeatured(false);
      setCampaignProducts([]);
      clearErrors();
      setLanguage(lang);
      return;
    }
  }, [setValue, id, openDrawer, clearErrors, lang]);

  // Load campaign data for edit
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await CampaignServices.getCampaignById(id);
          if (res) {
            setResData(res);
            setValue("title", res.title[language ? language : "en"]);
            setValue(
              "description",
              res.description?.[language ? language : "en"] || "",
            );
            setValue("slug", res.slug);
            setValue(
              "startTime",
              dayjs(res.startTime).format("YYYY-MM-DDTHH:mm"),
            );
            setValue("endTime", dayjs(res.endTime).format("YYYY-MM-DDTHH:mm"));
            setValue("showSection", res.showSection || "home_middle");
            setPublished(res.status === "show");
            setIsFeatured(res.isFeatured || false);
            setImageUrl(res.banner || "");

            // Load campaign products
            if (res.products && res.products.length > 0) {
              setCampaignProducts(
                res.products.map((cp) => ({
                  product: cp.product,
                  originalPrice: cp.originalPrice,
                  campaignPrice: cp.campaignPrice,
                  discountType: cp.discountType,
                  discountValue: cp.discountValue,
                  stockLimit: cp.stockLimit,
                  soldCount: cp.soldCount || 0,
                  isActive: cp.isActive,
                })),
              );
            }
          }
        } catch (err) {
          // Handle validation errors from API and set field-level errors
          handleApiValidationErrors(err, setError, notifyError);
        }
      })();
    }
  }, [id]);

  return {
    language,
    control,
    register,
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
    setCampaignProducts,
    productSearchText,
    setProductSearchText,
    searchResults,
    searchLoading,
    searchProducts,
    addProductToCampaign,
    removeProductFromCampaign,
    updateCampaignProduct,
    showingTranslateValue,
  };
};

export default useCampaignSubmit;
