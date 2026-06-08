import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import ReactSelect from "react-select";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import Uploader from "@/components/image-uploader/Uploader";

const fieldRow = "grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3";
const labelClass = "block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground md:mb-1";

const Offer = ({
  errors,
  isSave,
  coupons,
  register,
  setOffersPageHeader,
  offersPageHeader,
  setOffersHeaderBg,
  offersHeaderBg,
  couponList1,
  setCouponList1,
  isSubmitting,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("section-page-header");

  const navItems = [
    { id: "section-page-header", label: t("PageHeader") },
  ];

  return (
    <div className="font-sans lg:pr-4 space-y-0">
      <div className="flex flex-col lg:flex-row gap-0 relative">

        {/* ── Sidebar Nav ── */}
        <nav className="w-full lg:w-xs shrink-0 lg:sticky top-0 self-start overflow-y-auto bg-card rounded-lg border border-border pt-6 mb-6 lg:mb-0 lg:mr-6">
          <ul className="flex flex-col mb-4 lg:mb-6">
            {navItems.map((item) => (
              <li key={item.id} className="px-3 mb-1">
                <button
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-150 rounded-md ${
                    activeSection === item.id
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0">

          {/* Page Header */}
          <div className={activeSection === "section-page-header" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("Offers")}</h3>
              </div>

              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setOffersPageHeader} processOption={offersPageHeader} name={offersPageHeader} />
                </div>
              </div>

              <div style={{ height: offersPageHeader ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !offersPageHeader ? "hidden" : "visible", opacity: !offersPageHeader ? "0" : "1" }}>
                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("PageHeaderBg")}</label>
                  <div className="sm:col-span-4">
                    <Uploader imageUrl={offersHeaderBg} setImageUrl={setOffersHeaderBg} />
                  </div>
                </div>

                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("PageTitle")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Page Title" name="offers_page_title" type="text" placeholder={t("PageTitle")} />
                    <Error errorName={errors.offers_page_title} />
                  </div>
                </div>

                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("SuperDiscountActiveCouponCode")}</label>
                  <div className="sm:col-span-4">
                    <ReactSelect
                      isMulti
                      options={coupons}
                      value={couponList1}
                      onChange={(v) => setCouponList1(v)}
                      placeholder="Select Coupon"
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
                </div>
              </div>
            </div>
          </div>

          {/* Update button */}
          <div className="flex justify-center pb-8">
            {isSubmitting ? (
              <Button disabled={true} type="button" className="h-12 px-10 rounded-lg text-base w-64">
                <img src={spinnerLoadingImage} alt="Loading" width={20} height={10} />{" "}
                <span className="font-serif ml-2 font-light">{t("Processing")}</span>
              </Button>
            ) : (
              <Button type="submit" className="h-12 px-10 rounded-lg text-base w-64">
                {isSave ? t("SaveBtn") : t("UpdateBtn")}
              </Button>
            )}
          </div>

        </div>{/* end flex-1 */}
      </div>
    </div>
  );
};

export default Offer;
