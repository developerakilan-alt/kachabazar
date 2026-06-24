/**
 * Validates if a URL is a valid remote image URL (http or https)
 * This prevents errors when local file paths or invalid URLs are used with next/image
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if the URL is a valid http/https URL
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("/")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Returns a valid image URL or a fallback
 * @param {string} url - The image URL to validate
 * @param {string} fallback - Optional fallback URL (defaults to null)
 * @returns {string|null} - The valid URL or fallback
 */
export const getValidImageUrl = (url, fallback = null) => {
  return isValidImageUrl(url) ? url : fallback;
};

const getStoreOrigin = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "";
};

/**
 * Normalizes backend-uploaded image URLs so Docker/admin-host uploads render
 * from the storefront host. Public external image providers are left as-is.
 */
export const normalizeStoreImageUrl = (url) => {
  if (!url || typeof url !== "string") return url;

  const value = url.trim();
  if (!value || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  const storeOrigin = getStoreOrigin();
  const isUploadPath = (pathname) =>
    pathname.startsWith("/static/uploads/") || pathname.startsWith("/uploads/");

  if (value.startsWith("/")) {
    if (storeOrigin && isUploadPath(value)) {
      return `${storeOrigin}${value}`;
    }
    return value;
  }

  try {
    const parsed = new URL(value);
    if (isUploadPath(parsed.pathname)) {
      if (storeOrigin) {
        return `${storeOrigin}${parsed.pathname}${parsed.search}`;
      }
      // Keep original URL when no store origin (avoids stripping admin domain)
      return value;
    }
  } catch {
    return value;
  }

  return value;
};
