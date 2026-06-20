"use server";

import { revalidateTag } from "next/cache";
import {
  baseURL,
  handleResponse,
  resilientFetch,
} from "@services/CommonService";

/**
 * Get store customization settings
 */
export async function getCustomizationSettings() {
  try {
    const response = await resilientFetch(
      `${baseURL}/setting/store/customization`,
      {
        cache: "no-store",
      },
    );

    const storeCustomizationSetting = await handleResponse(response);
    return {
      success: true,
      storeCustomizationSetting,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      storeCustomizationSetting: null,
      error: error.message,
    };
  }
}

/**
 * Get global settings (currency, etc.)
 */
export async function getGlobalSettings() {
  try {
    const response = await resilientFetch(`${baseURL}/setting/global`, {
      next: { revalidate: 60, tags: ["settings"] },
    });

    const globalSetting = await handleResponse(response);

    return {
      success: true,
      globalSetting,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      globalSetting: null,
      error: error.message,
    };
  }
}

/**
 * Get store settings
 */
export async function getStoreSettings() {
  try {
    const response = await resilientFetch(`${baseURL}/setting/store-setting`, {
      next: { revalidate: 300, tags: ["settings"] },
    });

    const storeSetting = await handleResponse(response);

    return {
      success: true,
      storeSetting,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      storeSetting: null,
      error: error.message,
    };
  }
}

/**
 * Get showing languages
 */
export async function getLanguages() {
  try {
    const response = await resilientFetch(`${baseURL}/language/show`, {
      next: { revalidate: 120 },
    });
    const languages = await handleResponse(response);
    return {
      success: true,
      languages,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      languages: [],
      error: error.message,
    };
  }
}

/**
 * Get store SEO settings
 */
export async function getSeoSettings() {
  try {
    const response = await resilientFetch(
      `${baseURL}/setting/store-setting/seo`,
      {
        next: { revalidate: 300, tags: ["settings"] },
      },
    );

    const seoSetting = await handleResponse(response);

    return {
      success: true,
      seoSetting,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      seoSetting: null,
      error: error.message,
    };
  }
}

/**
 * Revalidate settings cache
 */
export async function revalidateSettings() {
  revalidateTag("settings");
}
