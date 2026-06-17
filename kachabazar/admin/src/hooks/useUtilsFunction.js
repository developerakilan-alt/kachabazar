import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";

//internal imports
import { SidebarContext } from "@/context/SidebarContext";
import LanguageServices from "@/services/LanguageServices";
import SettingServices from "@/services/SettingServices";
import {
  formatPrice as formatPriceFn,
  formatNumber as formatNumberFn,
} from "@/utils/currencyFormat";

// import { languages } from "@/utils/data";

const useUtilsFunction = () => {
  const { lang } = useContext(SidebarContext);

  const {
    error,
    isLoading: loading,
    data: globalSetting,
  } = useQuery({
    queryKey: ["globalSetting"],
    queryFn: () => SettingServices.getGlobalSetting(),
    staleTime: 20 * 60 * 1000, //cache for 20 minutes,
    gcTime: 25 * 60 * 1000,
  });

  const {
    data: languages,
    error: langError,
    isLoading: langLoading,
  } = useQuery({
    queryKey: ["languages"],
    queryFn: () => LanguageServices.getShowingLanguage(),
    staleTime: 20 * 60 * 1000, //cache for 20 minutes,
    gcTime: 25 * 60 * 1000,
  });

  // console.log("globalSetting", globalSetting, "language", languages);
  //for date and time format
  const showTimeFormat = (data, timeFormat) => {
    return dayjs(data).format(timeFormat);
  };

  const showDateFormat = (data) => {
    return dayjs(data).format(globalSetting?.default_date_format);
  };

  const showDateTimeFormat = (data) => {
    return dayjs(data).format(`${globalSetting?.default_date_format}  h:mm A`);
  };

  //for formatting number

  const getNumber = (value = 0) => {
    return Number(parseFloat(value || 0).toFixed(2));
  };

  const getNumberTwo = (value = 0) => {
    return parseFloat(value || 0).toFixed(globalSetting?.floating_number || 2);
  };

  //for translation
  const showingTranslateValue = useMemo(() => {
    return (data) => {
      if (!data) return "";
      // If data is already a string (pre-translated), return it directly
      if (typeof data === "string") return data;
      if (typeof data !== "object") return "";

      const result =
        data[lang] ?? data[globalSetting?.default_language] ?? data["en"] ?? "";

      // Ensure we always return a string, not an object
      if (typeof result === "object") {
        return JSON.stringify(result);
      }
      return result;
    };
  }, [lang, globalSetting?.default_language]);

  const fixUrl = (url) => {
    if (!url || typeof url !== "string") return url;
    return url
      .replace(/http:\/\/localhost:5056/g, window.location.origin)
      .replace(/http:\/\/192\.168\.29\.108/g, window.location.origin);
  };

  const showingImage = (data) => {
    if (data === undefined) return data;
    return typeof data === "string" ? fixUrl(data) : data;
  };

  const showingUrl = (data) => {
    return data !== undefined ? data : "!#";
  };

  const currency = globalSetting?.default_currency || "₹";

  /**
   * Format a price with Intl locale-aware currency formatting.
   * Uses the admin's default_currency and current language.
   */
  const formatPrice = (value, customCurrency) => {
    const sym = customCurrency || currency;
    const decimals = globalSetting?.floating_number || 2;
    return formatPriceFn(value, sym, lang || "en", decimals);
  };

  /**
   * Format a number with locale-aware formatting (no currency symbol).
   */
  const formatNumber = (value) => {
    const decimals = globalSetting?.floating_number || 2;
    return formatNumberFn(value, lang || "en", decimals);
  };

  return {
    error,
    loading,
    currency,
    getNumber,
    langError,
    langLoading,
    getNumberTwo,
    formatPrice,
    formatNumber,
    showTimeFormat,
    showDateFormat,
    showingImage,
    showingUrl,
    fixUrl,
    languages,
    globalSetting,
    showDateTimeFormat,
    showingTranslateValue,
  };
};

export default useUtilsFunction;
