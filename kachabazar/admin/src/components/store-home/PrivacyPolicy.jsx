import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

//internal import
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import Error from "@/components/form/others/Error";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import Uploader from "@/components/image-uploader/Uploader";
import LexicalEditor from "@/components/form/input/LexicalEditor";

const fieldRow = "grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3";
const labelClass = "block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground md:mb-1";

const PrivacyPolicy = ({
  isSave,
  errors,
  register,
  textEdit,
  setTextEdit,
  privacyPolicy,
  setPrivacyPolicy,
  setPrivacyPolicyHeaderBg,
  privacyPolicyHeaderBg,
  setTermsConditions,
  termsConditions,
  setTermsConditionsHeaderBg,
  termsConditionsHeaderBg,
  termsConditionsTextEdit,
  setTermsConditionsTextEdit,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("section-privacy-policy");

  const navItems = [
    { id: "section-privacy-policy",   label: t("PrivacyPolicy") },
    { id: "section-terms-conditions", label: t("TermsConditions") },
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

          {/* Privacy Policy */}
          <div className={activeSection === "section-privacy-policy" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("PrivacyPolicy")}</h3>
              </div>

              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setPrivacyPolicy} processOption={privacyPolicy} name={privacyPolicy} />
                </div>
              </div>

              <div style={{ height: privacyPolicy ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !privacyPolicy ? "hidden" : "visible", opacity: !privacyPolicy ? "0" : "1" }}>
                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("PageHeaderBg")}</label>
                  <div className="sm:col-span-4">
                    <Uploader imageUrl={privacyPolicyHeaderBg} setImageUrl={setPrivacyPolicyHeaderBg} />
                  </div>
                </div>
                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("PageTitle")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Page Title" name="privacy_page_title" type="text" placeholder={t("PageTitle")} />
                    <Error errorName={errors.privacy_page_title} />
                  </div>
                </div>
                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("PageText")}</label>
                  <div className="sm:col-span-4">
                    <LexicalEditor value={textEdit} onChange={setTextEdit} placeholder={t("PageText")} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className={activeSection === "section-terms-conditions" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("TermsConditions")}</h3>
              </div>

              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setTermsConditions} processOption={termsConditions} name={termsConditions} />
                </div>
              </div>

              <div style={{ height: termsConditions ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !termsConditions ? "hidden" : "visible", opacity: !termsConditions ? "0" : "1" }}>
                <div className={`${fieldRow}`}>
                  <label className={labelClass}>{t("PageHeaderBg")}</label>
                  <div className="sm:col-span-4">
                    <Uploader imageUrl={termsConditionsHeaderBg} setImageUrl={setTermsConditionsHeaderBg} />
                  </div>
                </div>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("PageTitle")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Page Title" name="termsConditions_page_title" type="text" placeholder={t("PageTitle")} />
                    <Error errorName={errors.termsConditions_page_title} />
                  </div>
                </div>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("PageText")}</label>
                  <div className="sm:col-span-4">
                    <LexicalEditor value={termsConditionsTextEdit} onChange={setTermsConditionsTextEdit} placeholder={t("PageText")} />
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

export default PrivacyPolicy;
