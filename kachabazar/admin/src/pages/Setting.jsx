import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

//internal import
import Label from "@/components/form/label/Label";
import Error from "@/components/form/others/Error";
import PageTitle from "@/components/Typography/PageTitle";
import useSettingSubmit from "@/hooks/useSettingSubmit";
import InputArea from "@/components/form/input/InputArea";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import AnimatedContent from "@/components/common/AnimatedContent";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import SettingContainer from "@/components/settings/SettingContainer";
import SelectTimeZone from "@/components/form/selectOption/SelectTimeZone";
import SelectCurrency from "@/components/form/selectOption/SelectCurrency";
import SelectReceiptSize from "@/components/form/selectOption/SelectPrintSize";
import SelectLanguageThree from "@/components/form/selectOption/SelectLanguageThree";
import ThemeServices from "@/services/ThemeServices";
import Uploader from "@/components/image-uploader/Uploader";
import DocLink from "@/components/common/DocLink";
import { Controller } from "react-hook-form";

const Setting = () => {
  const {
    watch,
    errors,
    control,
    register,
    isSave,
    setValue,
    isSubmitting,
    onSubmit,
    handleSubmit,
    enableInvoice,
    setEnableInvoice,
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
  } = useSettingSubmit();

  const { t } = useTranslation();

  // Fetch themes for the theme selector
  const { data: themes } = useQuery({
    queryKey: ["themes-showing"],
    queryFn: ThemeServices.getShowingThemes,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between py-8 gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("GlobalSetting")}</PageTitle>
        </div>
      </div>

      <AnimatedContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SettingContainer
            isSave={isSave}
            title={t("GlobalSetting")}
            isSubmitting={isSubmitting}
          >
            <div className="flex-grow scrollbar-hide w-full max-h-full space-y-6 pb-20">
              {/* General Settings Section */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    General Settings
                    <DocLink
                      section="/backend-configuration"
                      anchor="#jwt-and-encryption-configuration"
                      label="JWT & Encryption setup guide"
                    />
                  </CardTitle>
                  <CardDescription>
                    Configure your basic application settings and preferences.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("NumberOfImagesPerProduct")} />

                    <div className="mt-2 md:mt-0 md:flex-1 sm:col-span-4">
                      <InputAreaTwo
                        required={true}
                        register={register}
                        label={t("NumberOfImagesPerProduct")}
                        name="number_of_image_per_product"
                        type="number"
                        placeholder={t("NumberOfImagesPerProduct")}
                      />
                      <Error errorName={errors.number_of_image_per_product} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("AllowAutoTranslation")} />
                    <div className="mt-2 sm:col-span-4">
                      <SwitchToggle
                        title={""}
                        handleProcess={setIsAllowAutoTranslation}
                        processOption={isAllowAutoTranslation}
                      />
                    </div>
                  </div>

                  <div
                    className={`grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 transition-all duration-600 ${
                      isAllowAutoTranslation
                        ? "opacity-100 visible h-auto"
                        : "opacity-0 invisible h-0 overflow-hidden"
                    }`}
                  >
                    <div>
                      <Label label={t("TranslationSecretKey")} />

                      <p className="mt-1 text-sm/6 text-muted-foreground">
                        You can create key from{" "}
                        <a
                          href="https://mymemory.translated.net/doc/keygen.php"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline hover:text-indigo-500"
                        >
                          here
                        </a>
                      </p>
                    </div>
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label={t("TranslationSecretKey")}
                        name="translation_key"
                        type="password"
                        placeholder={t("TranslationSecretKey")}
                        autoComplete="new-password"
                        required={isAllowAutoTranslation}
                      />
                      <Error errorName={errors.translation_key} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Active Theme" />
                    <div className="mt-2 sm:col-span-4">
                      <Controller
                        name="active_theme"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value || ""}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem key="none" value="none">
                                Default (No Theme)
                              </SelectItem>
                              {themes?.map((theme) => (
                                <SelectItem key={theme._id} value={theme._id}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-3 h-3 rounded-full border"
                                      style={{
                                        backgroundColor: `hsl(${theme.colors?.primary || "160 84% 39%"})`,
                                      }}
                                    />
                                    {theme.name}
                                    {theme.isDefault && " ⭐"}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("DefaultLanguage")} />
                    <div className="mt-2 sm:col-span-4">
                      <SelectLanguageThree
                        required
                        control={control}
                        setValue={setValue}
                        register={register}
                        name="default_language"
                        label={t("DefaultLanguage")}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("DefaultCurrency")} />
                    <div className="mt-2 sm:col-span-4">
                      <SelectCurrency
                        control={control}
                        name="default_currency"
                        label="Currency"
                        setValue={setValue}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("TimeZone")} />
                    <div className="mt-2 sm:col-span-4">
                      <SelectTimeZone
                        name="default_time_zone"
                        label="Time Zone"
                        control={control}
                      />
                      <Error errorName={errors.default_time_zone} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("DefaultDateFormat")} />
                    <div className="mt-2 sm:col-span-4">
                      <Controller
                        name="default_date_format"
                        control={control}
                        rules={{
                          required: "Default date format is required",
                        }}
                        render={({ field }) => (
                          <Select
                            value={field.value || ""}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("DefaultDateFormat")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem key="mmddyyyy" value="MM/DD/YYYY">
                                MM/DD/YYYY
                              </SelectItem>
                              <SelectItem key="dmmyyyy" value="D MMM, YYYY">
                                D MMM, YYYY
                              </SelectItem>
                              <SelectItem key="mmmdyyyy" value="MMM D, YYYY">
                                MMM D, YYYY
                              </SelectItem>
                              <SelectItem key="mdyyyy" value="M/D/YYYY">
                                M/D/YYYY
                              </SelectItem>
                              <SelectItem key="mmmmdyyyy" value="MMMM D, YYYY">
                                MMMM D, YYYY
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Error errorName={errors.default_date_format} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("ReceiptSize")} />
                    <div className="mt-2 sm:col-span-4">
                      <SelectReceiptSize
                        label="Receipt Size"
                        control={control}
                        name="receipt_size"
                        required={true}
                      />

                      <Error errorName={errors.receipt_size} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <div>
                      <Label label="Enable Guest Checkout" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Allow customers to place orders without creating an
                        account
                      </p>
                    </div>
                    <div className="mt-2 sm:col-span-4">
                      <SwitchToggle
                        id="enable-guest-order"
                        processOption={enableGuestOrder}
                        handleProcess={setEnableGuestOrder}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <div>
                      <Label label="Store Layout" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Choose a homepage layout style for your store
                      </p>
                    </div>
                    <div className="mt-2 sm:col-span-4">
                      <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                        {[
                          {
                            value: "default",
                            icon: "🏠",
                            label: "Default",
                            desc: "Classic grocery",
                          },
                          {
                            value: "modern",
                            icon: "✨",
                            label: "Modern",
                            desc: "Full-width hero",
                          },
                          {
                            value: "minimal",
                            icon: "🎯",
                            label: "Minimal",
                            desc: "Content-focused",
                          },
                          {
                            value: "clothing",
                            icon: "👗",
                            label: "Clothing",
                            desc: "Fashion & apparel",
                          },
                          {
                            value: "electronic",
                            icon: "💻",
                            label: "Electronic",
                            desc: "Tech & gadgets",
                          },
                        ].map((layout) => (
                          <button
                            key={layout.value}
                            type="button"
                            onClick={() => setStoreLayout(layout.value)}
                            className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-center transition-all ${
                              storeLayout === layout.value
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border hover:border-primary/40 hover:bg-muted"
                            }`}
                          >
                            <span className="text-2xl">{layout.icon}</span>
                            <span className="text-sm font-medium text-foreground">
                              {layout.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground leading-tight">
                              {layout.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Branding & Identity Section */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Branding & Identity</CardTitle>
                  <CardDescription>
                    Upload your brand logos, favicon, and site description.
                    These will appear on the store, invoices, and browser tabs.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <div>
                      <Label label="Site Logo (Dark)" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Main logo for light backgrounds
                      </p>
                    </div>
                    <div className="mt-2 sm:col-span-4">
                      <Uploader imageUrl={logo} setImageUrl={setLogo} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <div>
                      <Label label="Site Logo (Light)" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Logo for dark backgrounds / navbar
                      </p>
                    </div>
                    <div className="mt-2 sm:col-span-4">
                      <Uploader
                        imageUrl={logoLight}
                        setImageUrl={setLogoLight}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <div>
                      <Label label="Invoice Logo" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Logo printed on customer invoices
                      </p>
                    </div>
                    <div className="mt-2 sm:col-span-4">
                      <Uploader
                        imageUrl={invoiceLogo}
                        setImageUrl={setInvoiceLogo}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <div>
                      <Label label="Favicon" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Small icon shown in browser tabs (recommended 32×32 or
                        192×192)
                      </p>
                    </div>
                    <div className="mt-2 sm:col-span-4">
                      <Uploader imageUrl={favicon} setImageUrl={setFavicon} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Site Description" />
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Site Description"
                        name="site_description"
                        type="text"
                        placeholder="A short description of your store"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <div>
                      <Label label="Copyright Text" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Shown in the store footer
                      </p>
                    </div>
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Copyright Text"
                        name="copyright_text"
                        type="text"
                        placeholder="© 2026 Your Company. All rights reserved."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Settings Section */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Invoice Settings</CardTitle>
                  <CardDescription>
                    Configure invoice generation and email sending preferences.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="flex items-center gap-x-3">
                    <SwitchToggle
                      id="enable-invoice"
                      processOption={enableInvoice}
                      handleProcess={setEnableInvoice}
                    />
                    <label className="block text-sm/6 font-medium text-foreground">
                      Enable Invoice Send to Customer by email
                    </label>
                  </div>

                  <div
                    className={`transition-all duration-600 ${
                      enableInvoice
                        ? "opacity-100 visible h-auto"
                        : "opacity-0 invisible h-0 overflow-hidden"
                    }`}
                  >
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label="From Email" />

                      <div className="mt-2 sm:col-span-4">
                        <InputArea
                          required={enableInvoice}
                          register={register}
                          label="From Email"
                          name="from_email"
                          type="email"
                          placeholder="Enter from email on custom invoice"
                        />
                        <Error errorName={errors.from_email} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Information Section */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Enter your company details that will appear on invoices and
                    receipts.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="From Email" />

                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        required={true}
                        register={register}
                        label={t("ShopName")}
                        name="shop_name"
                        type="text"
                        placeholder={t("ShopName")}
                      />
                      <Error errorName={errors.shop_name} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("InvoiceCompanyName")} />
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        required={true}
                        register={register}
                        label={t("InvoiceCompanyName")}
                        name="company_name"
                        type="text"
                        placeholder={t("InvoiceCompanyName")}
                      />
                      <Error errorName={errors.company_name} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("VatNumber")} />
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label={t("VatNumber")}
                        name="vat_number"
                        type="text"
                        placeholder={t("VatNumber")}
                      />
                      <Error errorName={errors.vat_number} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("AddressLine")} />

                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        required={true}
                        register={register}
                        label="Address"
                        name="address"
                        type="text"
                        placeholder="Address"
                      />
                      <Error errorName={errors.address} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("PostCode")} />

                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Post Code"
                        name="post_code"
                        type="text"
                        placeholder="Post Code"
                      />
                      <Error errorName={errors.post_code} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information Section */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Provide contact details for customer communication and
                    support.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("GlobalContactNumber")} />
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        required={true}
                        register={register}
                        label="Phone"
                        name="contact"
                        type="text"
                        placeholder="Contact Number"
                      />
                      <Error errorName={errors.contact} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("FooterEmail")} />

                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        required={true}
                        register={register}
                        label="Email"
                        name="email"
                        type="text"
                        placeholder="Email"
                      />
                      <Error errorName={errors.email} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("WebSite")} />

                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Website"
                        name="website"
                        type="text"
                        placeholder="Web Site"
                      />
                      <Error errorName={errors.website} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Configuration Section */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Email Configuration (SMTP)
                    <DocLink
                      section="/backend-configuration"
                      anchor="#email-configuration-smtp"
                      label="SMTP setup guide"
                    />
                  </CardTitle>
                  <CardDescription>
                    Configure email sending for order confirmations, password
                    resets, and OTP verification. Passwords are stored encrypted
                    in the database.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="SMTP Host" />
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="SMTP Host"
                        name="email_host"
                        type="text"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="SMTP Port" />
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="SMTP Port"
                        name="email_port"
                        type="text"
                        placeholder="465"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Email User" />
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Email User"
                        name="email_user"
                        type="email"
                        placeholder="your@gmail.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <div>
                      <Label label="Email Password / App Password" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        For Gmail, use an App Password. Clear field and type new
                        value to change.
                      </p>
                    </div>
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Email Password"
                        name="email_pass"
                        type="password"
                        placeholder="App password or SMTP password"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SMS/OTP Configuration Section */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    SMS / OTP Configuration
                    <DocLink
                      section="/backend-configuration"
                      anchor="#sms--phone-otp-configuration"
                      label="SMS providers setup guide"
                    />
                  </CardTitle>
                  <CardDescription>
                    Configure phone verification and SMS sending. Choose a
                    provider and enter your credentials. All API keys are
                    encrypted at rest.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="App Name" />
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="App Name"
                        name="app_name"
                        type="text"
                        placeholder="hautecouturejewellery"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="SMS Sender ID" />
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="SMS Sender ID"
                        name="sms_sender_id"
                        type="text"
                        placeholder="hautecouturejewellery"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <div>
                      <Label label="SMS Provider" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Use &ldquo;Mock&rdquo; for development (logs OTP to
                        console)
                      </p>
                    </div>
                    <div className="mt-2 sm:col-span-4">
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {[
                          { value: "mock", label: "Mock", url: null },
                          {
                            value: "twilio",
                            label: "Twilio",
                            url: "https://www.twilio.com/try-twilio",
                          },
                          {
                            value: "messagebird",
                            label: "MessageBird",
                            url: "https://www.messagebird.com/en/signup",
                          },
                          {
                            value: "vonage",
                            label: "Vonage",
                            url: "https://dashboard.nexmo.com/sign-up",
                          },
                          {
                            value: "aws_sns",
                            label: "AWS SNS",
                            url: "https://aws.amazon.com/sns/",
                          },
                        ].map((p) => (
                          <div
                            key={p.value}
                            className="flex flex-col items-center gap-1"
                          >
                            <button
                              type="button"
                              onClick={() => setSmsProvider(p.value)}
                              className={`w-full rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all ${
                                smsProvider === p.value
                                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                  : "border-border hover:border-primary/40 hover:bg-muted"
                              }`}
                            >
                              {p.label}
                            </button>
                            {p.url && (
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-primary hover:underline"
                              >
                                Sign up →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Twilio fields */}
                  <div
                    className={`space-y-6 transition-all duration-500 ${
                      smsProvider === "twilio"
                        ? "opacity-100 visible"
                        : "opacity-0 invisible h-0 overflow-hidden"
                    }`}
                  >
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label="Twilio Account SID" />
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Twilio Account SID"
                          name="twilio_account_sid"
                          type="password"
                          placeholder="ACxxxxxxxxxxxxx"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label="Twilio Auth Token" />
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Twilio Auth Token"
                          name="twilio_auth_token"
                          type="password"
                          placeholder="Auth token"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label="Twilio Phone Number" />
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Twilio Phone Number"
                          name="twilio_phone_number"
                          type="text"
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <div>
                        <Label label="Messaging Service SID" />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Optional — alternative to Phone Number
                        </p>
                      </div>
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Messaging Service SID"
                          name="twilio_messaging_service_sid"
                          type="password"
                          placeholder="MGxxxxxxxxxxxxx"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  </div>

                  {/* MessageBird fields */}
                  <div
                    className={`space-y-6 transition-all duration-500 ${
                      smsProvider === "messagebird"
                        ? "opacity-100 visible"
                        : "opacity-0 invisible h-0 overflow-hidden"
                    }`}
                  >
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label="MessageBird API Key" />
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="MessageBird API Key"
                          name="messagebird_api_key"
                          type="password"
                          placeholder="API Key"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vonage fields */}
                  <div
                    className={`space-y-6 transition-all duration-500 ${
                      smsProvider === "vonage"
                        ? "opacity-100 visible"
                        : "opacity-0 invisible h-0 overflow-hidden"
                    }`}
                  >
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label="Vonage API Key" />
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Vonage API Key"
                          name="vonage_api_key"
                          type="password"
                          placeholder="API Key"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label="Vonage API Secret" />
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Vonage API Secret"
                          name="vonage_api_secret"
                          type="password"
                          placeholder="API Secret"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  </div>

                  {/* AWS SNS fields */}
                  <div
                    className={`space-y-6 transition-all duration-500 ${
                      smsProvider === "aws_sns"
                        ? "opacity-100 visible"
                        : "opacity-0 invisible h-0 overflow-hidden"
                    }`}
                  >
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label="AWS Access Key ID" />
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="AWS Access Key ID"
                          name="aws_access_key_id"
                          type="password"
                          placeholder="AKIA..."
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label="AWS Secret Access Key" />
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="AWS Secret Access Key"
                          name="aws_secret_access_key"
                          type="password"
                          placeholder="Secret key"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label="AWS Region" />
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="AWS Region"
                          name="aws_region"
                          type="text"
                          placeholder="us-east-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application URLs Section */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Application URLs
                    <DocLink
                      section="/backend-configuration"
                      anchor="#application-urls"
                      label="URLs configuration guide"
                    />
                  </CardTitle>
                  <CardDescription>
                    Set the live URLs for your store and admin dashboard. These
                    are used in password reset emails and verification links.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Store URL" />
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Store URL"
                        name="store_url"
                        type="text"
                        placeholder="https://your-store.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Admin URL" />
                    <div className="mt-2 sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Admin URL"
                        name="admin_url"
                        type="text"
                        placeholder="https://your-admin.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SettingContainer>
        </form>
      </AnimatedContent>
    </>
  );
};
export default Setting;
