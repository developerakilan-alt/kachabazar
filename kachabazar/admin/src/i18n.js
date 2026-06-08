import i18n from "i18next";
import Cookies from "js-cookie";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "@/utils/translation/en.json";
import de from "@/utils/translation/de.json";
import bn from "@/utils/translation/bn.json";
import hi from "@/utils/translation/hi.json";
import es from "@/utils/translation/es.json";
import fr from "@/utils/translation/fr.json";
import ar from "@/utils/translation/ar.json";

// Get default language from global settings or fallback to 'en'
const defaultLanguage = Cookies.get("i18next") || "en";
// console.log("defaultLanguage", defaultLanguage);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      bn: { translation: bn },
      hi: { translation: hi },
      es: { translation: es },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    debug: false, // Disable debug mode to reduce console noise
    lng: defaultLanguage, // 👈 Set starting language
    fallbackLng: "en", // 👈 Only fallback if missing translations
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["cookie", "htmlTag", "navigator"], // 👈 Make cookie first priority
      caches: ["cookie"],
    },
  });
