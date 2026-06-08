import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//internal import
import useDisableForDemo from "./useDisableForDemo";
import { SidebarContext } from "@/context/SidebarContext";
import SettingServices from "@/services/SettingServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useSettingSubmit = (id) => {
  const { setIsUpdate } = useContext(SidebarContext);
  const [isSave, setIsSave] = useState(true);
  const [enableInvoice, setEnableInvoice] = useState(false);
  const [enableGuestOrder, setEnableGuestOrder] = useState(false);
  const [isAllowAutoTranslation, setIsAllowAutoTranslation] = useState(false);
  const [storeLayout, setStoreLayout] = useState("default");

  // Branding & logo states
  const [logo, setLogo] = useState("");
  const [logoLight, setLogoLight] = useState("");
  const [invoiceLogo, setInvoiceLogo] = useState("");
  const [favicon, setFavicon] = useState("");

  // SMS provider state
  const [smsProvider, setSmsProvider] = useState("mock");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleDisableForDemo } = useDisableForDemo();

  const {
    watch,
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // console.log("errors", errors);
  // console.log("enabledCOD", enabledCOD);

  const onSubmit = async (data) => {
    // console.log("data", data);
    if (handleDisableForDemo()) {
      return; // Exit the function if the feature is disabled
    }
    try {
      setIsSubmitting(true);
      const settingData = {
        name: "globalSetting",
        setting: {
          //for common setting
          number_of_image_per_product: data.number_of_image_per_product,
          shop_name: data.shop_name,
          address: data.address,
          // Branding
          logo: logo,
          logo_light: logoLight,
          invoice_logo: invoiceLogo,
          favicon: favicon,
          copyright_text: data.copyright_text,
          site_description: data.site_description,
          company_name: data.company_name,
          vat_number: data.vat_number,
          post_code: data.post_code,
          contact: data.contact,
          email: data.email,
          website: data.website,
          receipt_size: data.receipt_size,
          default_language: data.default_language,
          default_currency: data.default_currency,
          default_currency_name: data.default_currency_name,
          default_time_zone: data.default_time_zone,
          default_date_format: data.default_date_format,
          email_to_customer: enableInvoice,
          from_email: data.from_email,
          allow_auto_trans: isAllowAutoTranslation,
          translation_key: data.translation_key,
          enable_guest_order: enableGuestOrder,
          store_layout: storeLayout || "default",
          active_theme: data.active_theme || "none",

          // ── Email Configuration ──
          email_service: data.email_service,
          email_host: data.email_host,
          email_port: data.email_port,
          email_user: data.email_user,
          // Only send password if user typed a new one (not masked)
          ...(data.email_pass && !data.email_pass.startsWith("•")
            ? { email_pass: data.email_pass }
            : {}),

          // ── SMS Configuration ──
          sms_provider: smsProvider,
          sms_sender_id: data.sms_sender_id,
          app_name: data.app_name,
          // Twilio — only send if not masked
          ...(data.twilio_account_sid &&
          !data.twilio_account_sid.startsWith("•")
            ? { twilio_account_sid: data.twilio_account_sid }
            : {}),
          ...(data.twilio_auth_token && !data.twilio_auth_token.startsWith("•")
            ? { twilio_auth_token: data.twilio_auth_token }
            : {}),
          twilio_phone_number: data.twilio_phone_number,
          ...(data.twilio_messaging_service_sid &&
          !data.twilio_messaging_service_sid.startsWith("•")
            ? {
                twilio_messaging_service_sid: data.twilio_messaging_service_sid,
              }
            : {}),
          // MessageBird
          ...(data.messagebird_api_key &&
          !data.messagebird_api_key.startsWith("•")
            ? { messagebird_api_key: data.messagebird_api_key }
            : {}),
          // Vonage
          ...(data.vonage_api_key && !data.vonage_api_key.startsWith("•")
            ? { vonage_api_key: data.vonage_api_key }
            : {}),
          ...(data.vonage_api_secret && !data.vonage_api_secret.startsWith("•")
            ? { vonage_api_secret: data.vonage_api_secret }
            : {}),
          // AWS SNS
          ...(data.aws_access_key_id && !data.aws_access_key_id.startsWith("•")
            ? { aws_access_key_id: data.aws_access_key_id }
            : {}),
          ...(data.aws_secret_access_key &&
          !data.aws_secret_access_key.startsWith("•")
            ? { aws_secret_access_key: data.aws_secret_access_key }
            : {}),
          aws_region: data.aws_region,

          // ── Application URLs ──
          store_url: data.store_url,
          admin_url: data.admin_url,
        },
      };

      // console.log("global setting", settingData, "data", data);
      // return;

      if (!isSave) {
        const res = await SettingServices.updateGlobalSetting(settingData);

        if (res) {
          // Revalidate store cache
          try {
            const storeUrl =
              import.meta.env.VITE_APP_STORE_URL ||
              settingData?.setting?.store_url;
            await fetch(
              `${storeUrl}/api/revalidate?tag=settings&secret=hautecouturejewellery-revalidate-2024`,
            );
          } catch (e) {
            console.log("Store revalidation skipped:", e.message);
          }
          setIsUpdate(true);
          setIsSubmitting(false);

          notifySuccess(res.message);
        }
      } else {
        const res = await SettingServices.addGlobalSetting(settingData);
        // await socket.emit("notification", {
        //   message: `Global setting added`,
        //   option: "globalSetting",
        // });
        // Revalidate store cache
        try {
          const storeUrl =
            import.meta.env.VITE_APP_STORE_URL ||
            settingData?.setting?.store_url;
          await fetch(
            `${storeUrl}/api/revalidate?tag=settings&secret=hautecouturejewellery-revalidate-2024`,
          );
        } catch (e) {
          console.log("Store revalidation skipped:", e.message);
        }
        setIsUpdate(true);
        setIsSubmitting(false);

        notifySuccess(res.message);
      }
    } catch (err) {
      // console.log("err", err);
      notifyError(err?.response?.data?.message || err?.message);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await SettingServices.getGlobalSetting();
        // console.log("res>>>", res);
        if (res) {
          setIsSave(false);
          setValue(
            "number_of_image_per_product",
            res.number_of_image_per_product,
          );
          setValue("shop_name", res.shop_name);
          setValue("address", res.address);
          setValue("company_name", res.company_name);
          setValue("vat_number", res.vat_number);
          setValue("post_code", res.post_code);
          setValue("contact", res.contact);
          setValue("email", res.email);
          setValue("website", res.website);
          setValue("receipt_size", res.receipt_size);
          setValue("default_language", res.default_language);
          setValue("default_currency", res.default_currency);
          setValue("default_currency_name", res?.default_currency_name);
          setValue("default_time_zone", res?.default_time_zone);
          setValue("default_date_format", res?.default_date_format);
          setValue("from_email", res?.from_email);
          setEnableInvoice(res?.email_to_customer || false);
          setValue("translation_key", res?.translation_key);
          // Branding
          setLogo(res?.logo || "");
          setLogoLight(res?.logo_light || "");
          setInvoiceLogo(res?.invoice_logo || "");
          setFavicon(res?.favicon || "");
          setValue("copyright_text", res?.copyright_text);
          setValue("site_description", res?.site_description);
          setIsAllowAutoTranslation(res?.allow_auto_trans || false);
          setEnableGuestOrder(res?.enable_guest_order || false);
          setStoreLayout(res?.store_layout || "default");
          setValue("active_theme", res?.active_theme || "none");

          // Email Config
          setValue("email_service", res?.email_service || "");
          setValue("email_host", res?.email_host || "");
          setValue("email_port", res?.email_port || "");
          setValue("email_user", res?.email_user || "");
          setValue("email_pass", res?.email_pass || "");

          // SMS Config
          setSmsProvider(res?.sms_provider || "mock");
          setValue("sms_sender_id", res?.sms_sender_id || "");
          setValue("app_name", res?.app_name || "");
          setValue("twilio_account_sid", res?.twilio_account_sid || "");
          setValue("twilio_auth_token", res?.twilio_auth_token || "");
          setValue("twilio_phone_number", res?.twilio_phone_number || "");
          setValue(
            "twilio_messaging_service_sid",
            res?.twilio_messaging_service_sid || "",
          );
          setValue("messagebird_api_key", res?.messagebird_api_key || "");
          setValue("vonage_api_key", res?.vonage_api_key || "");
          setValue("vonage_api_secret", res?.vonage_api_secret || "");
          setValue("aws_access_key_id", res?.aws_access_key_id || "");
          setValue("aws_secret_access_key", res?.aws_secret_access_key || "");
          setValue("aws_region", res?.aws_region || "us-east-1");

          // Application URLs
          setValue("store_url", res?.store_url || "");
          setValue("admin_url", res?.admin_url || "");
        }
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      }
    })();
  }, []);

  return {
    watch,
    control,
    setValue,
    errors,
    register,
    isSave,
    isSubmitting,
    onSubmit,
    enableInvoice,
    setEnableInvoice,
    handleSubmit,
    enableGuestOrder,
    setEnableGuestOrder,
    storeLayout,
    setStoreLayout,
    isAllowAutoTranslation,
    setIsAllowAutoTranslation,
    // SMS
    smsProvider,
    setSmsProvider,
    // Branding
    logo,
    setLogo,
    logoLight,
    setLogoLight,
    invoiceLogo,
    setInvoiceLogo,
    favicon,
    setFavicon,
  };
};

export default useSettingSubmit;
