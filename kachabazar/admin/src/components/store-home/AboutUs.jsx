import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import TextAreaCom from "@/components/form/others/TextAreaCom";
import Uploader from "@/components/image-uploader/Uploader";

const fieldRow = "grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3";
const labelClass = "block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground md:mb-1";

const AboutUs = ({
  isSave,
  register,
  errors,
  setAboutHeaderBg,
  aboutHeaderBg,
  setAboutPageHeader,
  aboutPageHeader,
  setAboutTopContentLeft,
  aboutTopContentLeft,
  setAboutTopContentRight,
  aboutTopContentRight,
  setAboutTopContentRightImage,
  aboutTopContentRightImage,
  setAboutMiddleContentSection,
  aboutMiddleContentSection,
  setAboutMiddleContentImage,
  aboutMiddleContentImage,
  setOurFounderSection,
  ourFounderSection,
  setOurFounderOneImage,
  ourFounderOneImage,
  setOurFounderTwoImage,
  ourFounderTwoImage,
  setOurFounderThreeImage,
  ourFounderThreeImage,
  setOurFounderFourImage,
  ourFounderFourImage,
  setOurFounderFiveImage,
  ourFounderFiveImage,
  setOurFounderSixImage,
  ourFounderSixImage,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("section-page-header");

  const navItems = [
    { id: "section-page-header",        label: t("PageHeader") },
    { id: "section-top-content-left",   label: t("AboutPageTopContentLeft") },
    { id: "section-top-content-right",  label: t("PageTopContentRight") },
    { id: "section-middle-content",     label: t("MiddleContentSection") },
    { id: "section-our-founder",        label: t("OurFounder") },
  ];

  return (
    <div className="font-sans lg:pr-4 space-y-0">
      <div className="flex flex-col lg:flex-row gap-0 relative">

        {/* ── Vertical Sidebar Nav ── */}
        <nav className="w-full lg:w-xs shrink-0 lg:sticky top-0 self-start overflow-y-auto bg-card rounded-lg border border-border pt-6 mb-6 lg:mb-0 lg:mr-6">
          <ul className="flex flex-col mb-4 lg:mb-6">
            {navItems.map((item) => (
              <li key={item.id} className="px-3 mb-1">
                <button
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-150 rounded-md ${
                    activeSection === item.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Section Content ── */}
        <div className="flex-1 min-w-0">

          {/* Page Header */}
          <div className={activeSection === "section-page-header" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("PageHeader")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setAboutPageHeader} processOption={aboutPageHeader} name={aboutPageHeader} />
                </div>
              </div>
              <div style={{ height: aboutPageHeader ? "auto" : 0, overflow:"hidden", transition:"all 0.5s", visibility: !aboutPageHeader ? "hidden":"visible", opacity: !aboutPageHeader ? "0":"1" }}>
                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("PageHeaderBg")}</label>
                  <div className="sm:col-span-4">
                    <Uploader imageUrl={aboutHeaderBg} setImageUrl={setAboutHeaderBg} />
                  </div>
                </div>
                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("PageTitle")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Page Title" name="about_page_title" type="text" placeholder={t("PageTitle")} />
                    <Error errorName={errors.about_page_title} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Content Left */}
          <div className={activeSection === "section-top-content-left" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("AboutPageTopContentLeft")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setAboutTopContentLeft} processOption={aboutTopContentLeft} name={aboutTopContentLeft} />
                </div>
              </div>
              <div style={{ height: aboutTopContentLeft ? "auto" : 0, overflow:"hidden", transition:"all 0.5s", visibility: !aboutTopContentLeft ? "hidden":"visible", opacity: !aboutTopContentLeft ? "0":"1" }}>
                {[
                  { label: t("TopTitle"),          name: "about_page_Top_title",                   el: "input" },
                  { label: t("TopDescription"),    name: "about_us_top_description",               el: "textarea" },
                  { label: t("BoxOneTitle"),        name: "about_page_Top_left_box_one_title",      el: "input" },
                  { label: t("BoxOneSubtitle"),     name: "about_page_Top_left_box_one_subtitle",   el: "input" },
                  { label: t("BoxOneDescription"),  name: "about_us_top_box_one_description",       el: "textarea" },
                  { label: t("BoxTwoTitle"),        name: "about_page_Top_left_box_two_title",      el: "input" },
                  { label: t("BoxTwoSubtitle"),     name: "about_page_Top_left_box_two_subtitle",   el: "input" },
                  { label: t("BoxTwoDescription"),  name: "about_us_top_box_two_description",       el: "textarea" },
                ].map(({ label, name, el }) => (
                  <div key={name} className={`${fieldRow} relative`}>
                    <label className={labelClass}>{label}</label>
                    <div className="sm:col-span-4">
                      {el === "input"
                        ? <InputAreaTwo register={register} label={label} name={name} type="text" placeholder={label} />
                        : <TextAreaCom required register={register} label={label} name={name} type="text" placeholder={label} />}
                      <Error errorName={errors[name]} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Content Right */}
          <div className={activeSection === "section-top-content-right" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("PageTopContentRight")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setAboutTopContentRight} processOption={aboutTopContentRight} name={aboutTopContentRight} />
                </div>
              </div>
              <div style={{ height: aboutTopContentRight ? "auto" : 0, overflow:"hidden", transition:"all 0.5s", visibility: !aboutTopContentRight ? "hidden":"visible", opacity: !aboutTopContentRight ? "0":"1" }}>
                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("TopContentRightImage")}</label>
                  <div className="sm:col-span-4">
                    <Uploader imageUrl={aboutTopContentRightImage} setImageUrl={setAboutTopContentRightImage} targetWidth={1050} targetHeight={805} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Content */}
          <div className={activeSection === "section-middle-content" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("MiddleContentSection")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setAboutMiddleContentSection} processOption={aboutMiddleContentSection} name={aboutMiddleContentSection} />
                </div>
              </div>
              <div style={{ height: aboutMiddleContentSection ? "auto" : 0, overflow:"hidden", transition:"all 0.5s", visibility: !aboutMiddleContentSection ? "hidden":"visible", opacity: !aboutMiddleContentSection ? "0":"1" }}>
                {[
                  { label: t("MiddleDescriptionOne"), name: "about_us_middle_description_one" },
                  { label: t("MiddleDescriptionTwo"), name: "about_us_middle_description_two" },
                ].map(({ label, name }) => (
                  <div key={name} className={fieldRow}>
                    <label className={labelClass}>{label}</label>
                    <div className="sm:col-span-4">
                      <TextAreaCom required register={register} label={label} name={name} type="text" placeholder={label} />
                      <Error errorName={errors[name]} />
                    </div>
                  </div>
                ))}
                <div className={fieldRow}>
                  <label className={labelClass}>{t("MiddleContentImage")}</label>
                  <div className="sm:col-span-4">
                    <Uploader imageUrl={aboutMiddleContentImage} setImageUrl={setAboutMiddleContentImage} targetWidth={1420} targetHeight={425} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Founder */}
          <div className={activeSection === "section-our-founder" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("OurFounder")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setOurFounderSection} processOption={ourFounderSection} name={ourFounderSection} />
                </div>
              </div>
              <div style={{ height: ourFounderSection ? "auto" : 0, overflow:"hidden", transition:"all 0.5s", visibility: !ourFounderSection ? "hidden":"visible", opacity: !ourFounderSection ? "0":"1" }}>
                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("OurFounderTitle")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Title" name="about_page_ourfounder_title" type="text" placeholder={t("OurFounderTitle")} />
                    <Error errorName={errors.about_page_ourfounder_title} />
                  </div>
                </div>
                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("OurFounderDescription")}</label>
                  <div className="sm:col-span-4">
                    <TextAreaCom required register={register} label="Our Founder Description" name="about_us_ourfounder_description" type="text" placeholder={t("OurFounderDescription")} />
                    <Error errorName={errors.about_us_ourfounder_description} />
                  </div>
                </div>

                <Tabs>
                  <TabList>
                    {[1,2,3,4,5,6].map(n => <Tab key={n}>{t("OurTeam")} {n}</Tab>)}
                  </TabList>
                  {[
                    { img: ourFounderOneImage,   setImg: setOurFounderOneImage,   imgKey:"OurFounderOneImage",   titleKey:"about_page_ourfounder_one_title",   titleLabel:"OurFounderOneTitle",   subKey:"about_page_ourfounder_one_sub_title",   subLabel:"OurFounderOneSubTitle" },
                    { img: ourFounderTwoImage,   setImg: setOurFounderTwoImage,   imgKey:"OurFounderTwoImage",   titleKey:"about_page_ourfounder_two_title",   titleLabel:"OurFounderTwoTitle",   subKey:"about_page_ourfounder_two_sub_title",   subLabel:"OurFounderTwoSubTitle" },
                    { img: ourFounderThreeImage, setImg: setOurFounderThreeImage, imgKey:"OurFounderThreeImage", titleKey:"about_page_ourfounder_three_title", titleLabel:"OurFounderThreeTitle", subKey:"about_page_ourfounder_three_sub_title", subLabel:"OurFounderThreeSubTitle" },
                    { img: ourFounderFourImage,  setImg: setOurFounderFourImage,  imgKey:"OurFounderFourImage",  titleKey:"about_page_ourfounder_four_title",  titleLabel:"OurFounderFourTitle",  subKey:"about_page_ourfounder_four_sub_title",  subLabel:"OurFounderFourSubTitle" },
                    { img: ourFounderFiveImage,  setImg: setOurFounderFiveImage,  imgKey:"OurFounderFiveImage",  titleKey:"about_page_ourfounder_five_title",  titleLabel:"OurFounderFiveTitle",  subKey:"about_page_ourfounder_five_sub_title",  subLabel:"OurFounderFiveSubTitle" },
                    { img: ourFounderSixImage,   setImg: setOurFounderSixImage,   imgKey:"OurFounderSixImage",   titleKey:"about_page_ourfounder_six_title",   titleLabel:"OurFounderSixTitle",   subKey:"about_page_ourfounder_six_sub_title",   subLabel:"OurFounderSixSubTitle" },
                  ].map(({ img, setImg, imgKey, titleKey, titleLabel, subKey, subLabel }) => (
                    <TabPanel key={imgKey} className="mt-6">
                      <div className={`${fieldRow} relative`}>
                        <label className={labelClass}>{t(imgKey)}</label>
                        <div className="sm:col-span-4">
                          <Uploader imageUrl={img} setImageUrl={setImg} targetWidth={600} targetHeight={600} />
                        </div>
                      </div>
                      <div className={fieldRow}>
                        <label className={labelClass}>{t(titleLabel)}</label>
                        <div className="sm:col-span-4">
                          <InputAreaTwo register={register} label="Title" name={titleKey} type="text" placeholder={t(titleLabel)} />
                          <Error errorName={errors[titleKey]} />
                        </div>
                      </div>
                      <div className={fieldRow}>
                        <label className={labelClass}>{t(subLabel)}</label>
                        <div className="sm:col-span-4">
                          <InputAreaTwo register={register} label="Sub Title" name={subKey} type="text" placeholder={t(subLabel)} />
                          <Error errorName={errors[subKey]} />
                        </div>
                      </div>
                    </TabPanel>
                  ))}
                </Tabs>
              </div>
            </div>
          </div>

          {/* ── Update Button ── */}
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

export default AboutUs;
