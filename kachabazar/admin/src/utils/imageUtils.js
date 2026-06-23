/**
 * Normalizes uploaded image URLs so they work from any origin.
 * If the URL is a full absolute URL pointing to an upload path,
 * strips the origin so the browser resolves it relative to the current origin.
 */
export const normalizeImageUrl = (url) => {
  if (!url || typeof url !== "string") return url;

  const value = url.trim();
  if (!value || value.startsWith("data:") || value.startsWith("blob:") || value.startsWith("/")) {
    return value;
  }

  try {
    const parsed = new URL(value);
    if (
      parsed.pathname.startsWith("/static/uploads/") ||
      parsed.pathname.startsWith("/uploads/")
    ) {
      return parsed.pathname + parsed.search;
    }
  } catch {
    return value;
  }

  return value;
};
