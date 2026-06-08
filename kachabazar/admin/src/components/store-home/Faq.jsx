import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import TextAreaCom from "@/components/form/others/TextAreaCom";
import Uploader from "@/components/image-uploader/Uploader";

const fieldRow = "grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3";
const labelClass = "block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground md:mb-1";

const faqItems = [
  { title: "FaqTitleOne",   desc: "FaqDescriptionOne",   titleName: "faq_title_one",   descName: "faq_description_one" },
  { title: "FaqTitleTwo",   desc: "FaqDescriptionTwo",   titleName: "faq_title_two",   descName: "faq_description_two" },
  { title: "FaqTitleThree", desc: "FaqDescriptionThree", titleName: "faq_title_three", descName: "faq_description_three" },
  { title: "FaqTitleFour",  desc: "FaqDescriptionFour",  titleName: "faq_title_four",  descName: "faq_description_four" },
  { title: "FaqTitleFive",  desc: "FaqDescriptionFive",  titleName: "faq_title_five",  descName: "faq_description_five" },
  { title: "FaqTitleSix",   desc: "FaqDescriptionSix",   titleName: "faq_title_six",   descName: "faq_description_six" },
  { title: "FaqTitleSeven", desc: "FaqDescriptionSeven", titleName: "faq_title_seven", descName: "faq_description_seven" },
  { title: "FaqTitleEight", desc: "FaqDescriptionEight", titleName: "faq_title_eight", descName: "faq_description_eight" },
];

const Faq = ({
  isSave,
  errors,
  register,
  setFaqStatus,
  faqStatus,
  setFaqHeaderBg,
  faqHeaderBg,
  setFaqLeftColImage,
  faqLeftColImage,
  setFaqLeftColStatus,
  faqLeftColStatus,
  setFaqRightColStatus,
  faqRightColStatus,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("section-faq-header");

  const navItems = [
    { id: "section-faq-header",   label: t("FAQPageHeader") },
    { id: "section-faq-left-col", label: t("FaqLeftCol") },
    { id: "section-faqs",         label: t("FAQS") },
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

          {/* FAQ Page Header */}
          <div className={activeSection === "section-faq-header" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("FAQPageHeader")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setFaqStatus} processOption={faqStatus} name={faqStatus} />
                </div>
              </div>
              <div style={{ height: faqStatus ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !faqStatus ? "hidden" : "visible", opacity: !faqStatus ? "0" : "1" }}>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("PageHeaderBg")}</label>
                  <div className="sm:col-span-4">
                    <Uploader imageUrl={faqHeaderBg} setImageUrl={setFaqHeaderBg} />
                  </div>
                </div>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("PageTitle")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Page Title" name="faq_page_title" type="text" placeholder={t("PageTitle")} />
                    <Error errorName={errors.faq_page_title} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Left Column */}
          <div className={activeSection === "section-faq-left-col" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("FaqLeftCol")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setFaqLeftColStatus} processOption={faqLeftColStatus} name={faqLeftColStatus} />
                </div>
              </div>
              <div style={{ height: faqLeftColStatus ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !faqLeftColStatus ? "hidden" : "visible", opacity: !faqLeftColStatus ? "0" : "1" }}>
                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("LeftImage")}</label>
                  <div className="sm:col-span-4">
                    <Uploader imageUrl={faqLeftColImage} setImageUrl={setFaqLeftColImage} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs (Q&A items) */}
          <div className={activeSection === "section-faqs" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("FAQS")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setFaqRightColStatus} processOption={faqRightColStatus} name={faqRightColStatus} />
                </div>
              </div>
              <div style={{ height: faqRightColStatus ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !faqRightColStatus ? "hidden" : "visible", opacity: !faqRightColStatus ? "0" : "1" }}>
                {faqItems.map(({ title, desc, titleName, descName }, i) => (
                  <div key={titleName} className="mb-6 pb-6 border-b border-border last:border-0 last:mb-0 last:pb-0">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">FAQ {i + 1}</p>
                    <div className={`${fieldRow} relative`}>
                      <label className={labelClass}>{t(title)}</label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo register={register} label="FAQ Title" name={titleName} type="text" placeholder={t(title)} />
                        <Error errorName={errors[titleName]} />
                      </div>
                    </div>
                    <div className={fieldRow}>
                      <label className={labelClass}>{t(desc)}</label>
                      <div className="sm:col-span-4">
                        <TextAreaCom register={register} label="FAQ Description" name={descName} type="text" placeholder={t(desc)} />
                        <Error errorName={errors[descName]} />
                      </div>
                    </div>
                  </div>
                ))}
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

export default Faq;
