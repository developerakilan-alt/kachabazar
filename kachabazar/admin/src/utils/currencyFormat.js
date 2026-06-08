/**
 * Currency formatting utilities for admin panel.
 * Uses Intl.NumberFormat for locale-aware number & currency formatting.
 */

// Map currency symbols → ISO 4217 codes
const symbolToCode = {
  $: "USD",
  "€": "EUR",
  "£": "GBP",
  "¥": "JPY",
  A$: "AUD",
  C$: "CAD",
  CHF: "CHF",
  "₹": "INR",
  "৳": "BDT",
  "₨": "PKR",
  R$: "BRL",
  "₩": "KRW",
  MX$: "MXN",
  S$: "SGD",
  HK$: "HKD",
  kr: "SEK",
  NZ$: "NZD",
  R: "ZAR",
  "₽": "RUB",
  "₺": "TRY",
  NT$: "TWD",
  "฿": "THB",
  Rp: "IDR",
  RM: "MYR",
  "₱": "PHP",
  "₫": "VND",
  zł: "PLN",
  Kč: "CZK",
  Ft: "HUF",
  lei: "RON",
  лв: "BGN",
  "Дін.": "RSD",
  kn: "HRK",
  "د.إ": "AED",
  "ر.س": "SAR",
  "د.ك": "KWD",
  "ر.ق": "QAR",
  "ر.ع.": "OMR",
  ".د.ب": "BHD",
  "د.أ": "JOD",
  "ج.م": "EGP",
  "د.ت": "TND",
  "د.م.": "MAD",
  KSh: "KES",
  "₦": "NGN",
  "GH₵": "GHS",
  TSh: "TZS",
  USh: "UGX",
  "₸": "KZT",
  "₼": "AZN",
  "₾": "GEL",
};

// Map language codes → locale strings
const langToLocale = {
  en: "en-US",
  bn: "bn-BD",
  ar: "ar-SA",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  pt: "pt-BR",
  hi: "hi-IN",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  ru: "ru-RU",
  tr: "tr-TR",
  it: "it-IT",
  nl: "nl-NL",
  pl: "pl-PL",
  th: "th-TH",
  vi: "vi-VN",
  id: "id-ID",
  ms: "ms-MY",
  sv: "sv-SE",
  da: "da-DK",
  nb: "no-NO",
  fi: "fi-FI",
};

// Map ISO currency codes → native locale for that currency's numeral system
const currencyCodeToLocale = {
  BDT: "bn-BD",
  INR: "hi-IN",
  NPR: "ne-NP",
  LKR: "si-LK",
  MMK: "my-MM",
  THB: "th-TH",
  KHR: "km-KH",
  LAK: "lo-LA",
  JPY: "ja-JP",
  CNY: "zh-CN",
  KRW: "ko-KR",
  SAR: "ar-SA",
  AED: "ar-AE",
  EGP: "ar-EG",
  KWD: "ar-KW",
  QAR: "ar-QA",
  BHD: "ar-BH",
  OMR: "ar-OM",
  JOD: "ar-JO",
  IQD: "ar-IQ",
  IRR: "fa-IR",
  AFN: "fa-AF",
};

/**
 * Get the ISO currency code from a currency symbol.
 */
export function getCurrencyCode(symbol) {
  if (!symbol) return "USD";
  return symbolToCode[symbol] || "USD";
}

/**
 * Get the locale string from a language code.
 */
export function getLocale(lang) {
  if (!lang) return "en-US";
  return langToLocale[lang] || "en-US";
}

/**
 * Get the best locale for a given currency code.
 * Uses the currency's native locale so numerals match the currency
 * (e.g. BDT → bn-BD → ৯০.৭৮৳).
 * Falls back to the admin UI language locale.
 */
function getLocaleForCurrency(currencyCode, lang) {
  return currencyCodeToLocale[currencyCode] || getLocale(lang);
}

/**
 * Format a price with locale-aware currency formatting.
 * The locale is derived from the currency so numerals match
 * (e.g. BDT → Bengali numerals, INR → Devanagari, etc.).
 *
 * @param {number} value - The numeric value
 * @param {string} currencySymbol - The currency symbol (e.g., "$", "৳")
 * @param {string} lang - Language code (e.g., "en", "bn")
 * @param {number} decimals - Decimal digits (default 2)
 * @returns {string} Formatted price string
 */
export function formatPrice(
  value,
  currencySymbol = "$",
  lang = "en",
  decimals = 2,
) {
  const num = Number(parseFloat(value || 0).toFixed(decimals));
  const currencyCode = getCurrencyCode(currencySymbol);
  const locale = getLocaleForCurrency(currencyCode, lang);

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return `${currencySymbol}${num.toFixed(decimals)}`;
  }
}

/**
 * Format a number with locale-aware formatting (no currency symbol).
 * Uses the currency's native locale when available.
 *
 * @param {number} value - The numeric value
 * @param {string} lang - Language code
 * @param {number} decimals - Decimal digits (default 2)
 * @param {string} [currencySymbol] - Optional currency symbol to pick locale from
 * @returns {string} Formatted number string
 */
export function formatNumber(value, lang = "en", decimals = 2, currencySymbol) {
  const num = Number(parseFloat(value || 0).toFixed(decimals));
  const locale = currencySymbol
    ? getLocaleForCurrency(getCurrencyCode(currencySymbol), lang)
    : getLocale(lang);

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return num.toFixed(decimals);
  }
}
